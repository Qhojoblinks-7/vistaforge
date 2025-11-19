import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.conf import settings
from .models import TimeLog, TimeLogEntry
from typing import Dict, Any, List


# --- Authentication Mixin ---
class LoginRequiredMixin:
    """A mixin to ensure the user is authenticated for sensitive operations."""
    @classmethod
    def mutate(cls, root, info, **kwargs):
        if not info.context.user or not info.context.user.is_authenticated:
            raise Exception("Authentication required.")
        return super().mutate(root, info, **kwargs)


# --- GraphQL Types ---
class TimeLogEntryType(DjangoObjectType):
    class Meta:
        model = TimeLogEntry
        fields = '__all__'


class TimeLogType(DjangoObjectType):
    class Meta:
        model = TimeLog
        fields = ('id', 'user', 'client', 'start_time', 'end_time', 'duration_minutes', 'description', 'task_name', 'status', 'is_billable', 'hourly_rate', 'created_at', 'updated_at')

    # Add computed fields
    durationHours = graphene.Float()
    totalCost = graphene.Float()

    def resolve_durationHours(self, info):
        return self.duration_hours

    def resolve_totalCost(self, info):
        return self.total_cost


# --- Input Types ---
class TimeLogEntryInput(graphene.InputObjectType):
    start_time = graphene.DateTime(required=True)
    end_time = graphene.DateTime()
    duration_minutes = graphene.Int()
    notes = graphene.String()


class TimeLogInput(graphene.InputObjectType):
    client_id = graphene.ID()
    start_time = graphene.DateTime(required=True)
    end_time = graphene.DateTime()
    duration_minutes = graphene.Int()
    description = graphene.String()
    task_name = graphene.String(required=True)
    status = graphene.String()
    is_billable = graphene.Boolean()
    hourly_rate = graphene.Float()


# --- Queries ---
class TimeLogQuery(graphene.ObjectType):
    # Time logs
    all_time_logs = graphene.List(
        TimeLogType,
        status=graphene.String(),
        client_id=graphene.ID(),
        date_from=graphene.Date(),
        date_to=graphene.Date(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    time_log = graphene.Field(TimeLogType, id=graphene.ID(required=True))

    # Time log entries
    time_log_entries = graphene.List(TimeLogEntryType, time_log_id=graphene.ID(required=True))

    # Analytics
    time_log_analytics = graphene.Field(graphene.JSONString)

    @staticmethod
    def resolve_all_time_logs(root, info, status=None, client_id=None, date_from=None, date_to=None, limit=None, offset=None):
        if not info.context.user.is_authenticated:
            return TimeLog.objects.none()

        queryset = TimeLog.objects.filter(user=info.context.user)

        if status:
            queryset = queryset.filter(status=status)

        if client_id:
            queryset = queryset.filter(client_id=client_id)

        if date_from:
            queryset = queryset.filter(start_time__date__gte=date_from)

        if date_to:
            queryset = queryset.filter(start_time__date__lte=date_to)

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    @staticmethod
    def resolve_time_log(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(TimeLog, pk=id, user=info.context.user)

    @staticmethod
    def resolve_time_log_entries(root, info, time_log_id):
        if not info.context.user.is_authenticated:
            return TimeLogEntry.objects.none()
        return TimeLogEntry.objects.filter(time_log_id=time_log_id, time_log__user=info.context.user)

    @staticmethod
    def resolve_time_log_analytics(root, info):
        if not info.context.user.is_authenticated:
            return "{}"

        time_logs = TimeLog.objects.filter(user=info.context.user)

        total_time_logs = time_logs.count()
        running_logs = time_logs.filter(status='RUNNING').count()
        total_duration = sum(log.duration_minutes for log in time_logs)
        billable_logs = time_logs.filter(is_billable=True).count()
        total_cost = sum(log.total_cost for log in time_logs if log.is_billable)

        import json
        return json.dumps({
            'totalTimeLogs': total_time_logs,
            'runningLogs': running_logs,
            'totalDurationMinutes': total_duration,
            'totalDurationHours': round(total_duration / 60, 2),
            'billableLogs': billable_logs,
            'totalCost': round(total_cost, 2),
        })


# --- Mutations ---
class CreateTimeLog(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = TimeLogInput(required=True)

    time_log = graphene.Field(TimeLogType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user

        # Handle client relationship
        client = None
        if input.get('client_id'):
            from clients_app.models import Client
            client = get_object_or_404(Client, pk=input['client_id'], user=user)

        time_log_data = {
            'user': user,
            'client': client,
            'start_time': input['start_time'],
            'task_name': input['task_name'],
        }

        # Add optional fields
        for field in ['end_time', 'duration_minutes', 'description', 'status', 'is_billable', 'hourly_rate']:
            if field in input:
                time_log_data[field] = input[field]

        time_log = TimeLog.objects.create(**time_log_data)
        return CreateTimeLog(time_log=time_log)


class UpdateTimeLog(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = TimeLogInput(required=True)

    time_log = graphene.Field(TimeLogType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        time_log = get_object_or_404(TimeLog, pk=id, user=user)

        # Handle client relationship
        if 'client_id' in input:
            if input['client_id']:
                from clients_app.models import Client
                client = get_object_or_404(Client, pk=input['client_id'], user=user)
                time_log.client = client
            else:
                time_log.client = None

        # Update other fields
        for field, value in input.items():
            if field != 'client_id':
                setattr(time_log, field, value)

        time_log.save()
        return UpdateTimeLog(time_log=time_log)


class DeleteTimeLog(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        time_log = get_object_or_404(TimeLog, pk=id, user=user)
        time_log.delete()
        return DeleteTimeLog(success=True)


class StartTimeLog(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        task_name = graphene.String(required=True)
        client_id = graphene.ID()
        description = graphene.String()

    time_log = graphene.Field(TimeLogType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, task_name, client_id=None, description=None):
        from django.utils import timezone
        user = info.context.user

        # Stop any currently running time logs for this user
        TimeLog.objects.filter(user=user, status='RUNNING').update(
            status='STOPPED',
            end_time=timezone.now()
        )

        # Handle client relationship
        client = None
        if client_id:
            from clients_app.models import Client
            client = get_object_or_404(Client, pk=client_id, user=user)

        time_log = TimeLog.objects.create(
            user=user,
            client=client,
            task_name=task_name,
            description=description,
            start_time=timezone.now(),
            status='RUNNING'
        )

        return StartTimeLog(time_log=time_log)


class StopTimeLog(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    time_log = graphene.Field(TimeLogType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        from django.utils import timezone
        user = info.context.user
        time_log = get_object_or_404(TimeLog, pk=id, user=user)

        if time_log.status == 'RUNNING':
            time_log.end_time = timezone.now()
            time_log.status = 'STOPPED'
            time_log.save()

        return StopTimeLog(time_log=time_log)


class CreateTimeLogEntry(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        time_log_id = graphene.ID(required=True)
        input = TimeLogEntryInput(required=True)

    entry = graphene.Field(TimeLogEntryType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, time_log_id, input):
        user = info.context.user
        time_log = get_object_or_404(TimeLog, pk=time_log_id, user=user)

        entry = TimeLogEntry.objects.create(time_log=time_log, **input)
        return CreateTimeLogEntry(entry=entry)


class UpdateTimeLogEntry(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = TimeLogEntryInput(required=True)

    entry = graphene.Field(TimeLogEntryType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        entry = get_object_or_404(TimeLogEntry, pk=id, time_log__user=user)

        for field, value in input.items():
            setattr(entry, field, value)
        entry.save()

        return UpdateTimeLogEntry(entry=entry)


class DeleteTimeLogEntry(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        entry = get_object_or_404(TimeLogEntry, pk=id, time_log__user=user)
        entry.delete()
        return DeleteTimeLogEntry(success=True)


# --- Mutation Aggregation ---
class TimeLogMutation(graphene.ObjectType):
    # Time log mutations
    create_time_log = CreateTimeLog.Field()
    update_time_log = UpdateTimeLog.Field()
    delete_time_log = DeleteTimeLog.Field()
    start_time_log = StartTimeLog.Field()
    stop_time_log = StopTimeLog.Field()

    # Time log entry mutations
    create_time_log_entry = CreateTimeLogEntry.Field()
    update_time_log_entry = UpdateTimeLogEntry.Field()
    delete_time_log_entry = DeleteTimeLogEntry.Field()