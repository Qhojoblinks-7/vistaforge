# admin_dashboard/schema.py

import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import AdminSettings, SystemLog, BackupRecord


# --- 1. Type Definitions ---

class AdminSettingsType(DjangoObjectType):
    """GraphQL Type for AdminSettings model."""
    class Meta:
        model = AdminSettings
        fields = '__all__'


class SystemLogType(DjangoObjectType):
    """GraphQL Type for SystemLog model."""
    class Meta:
        model = SystemLog
        fields = '__all__'


class BackupRecordType(DjangoObjectType):
    """GraphQL Type for BackupRecord model."""
    class Meta:
        model = BackupRecord
        fields = '__all__'


# --- 2. Input Types ---

class AdminSettingsInput(graphene.InputObjectType):
    """Input type for updating admin settings."""
    fullName = graphene.String()
    email = graphene.String()
    company = graphene.String()
    phone = graphene.String()
    defaultHourlyRate = graphene.Decimal()
    currency = graphene.String()
    timezone = graphene.String()
    language = graphene.String()
    emailReminders = graphene.Boolean()
    projectUpdates = graphene.Boolean()
    invoiceDueReminders = graphene.Boolean()
    marketingEmails = graphene.Boolean()
    maintenanceMode = graphene.Boolean()
    debugMode = graphene.Boolean()
    backupFrequency = graphene.String()
    theme = graphene.String()


# --- 3. Queries ---

class AdminDashboardQuery(graphene.ObjectType):
    """Queries for admin dashboard functionality."""

    admin_settings = graphene.Field(AdminSettingsType)
    system_logs = graphene.List(SystemLogType, limit=graphene.Int(), offset=graphene.Int())
    backup_records = graphene.List(BackupRecordType, limit=graphene.Int(), offset=graphene.Int())

    @staticmethod
    def resolve_admin_settings(root, info):
        """Get current user's admin settings."""
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        return AdminSettings.objects.get_or_create(user=info.context.user)[0]

    @staticmethod
    def resolve_system_logs(root, info, limit=50, offset=0):
        """Get system logs with pagination."""
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        return SystemLog.objects.all().order_by('-created_at')[offset:offset+limit]

    @staticmethod
    def resolve_backup_records(root, info, limit=20, offset=0):
        """Get backup records with pagination."""
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")
        return BackupRecord.objects.all().order_by('-created_at')[offset:offset+limit]


# --- 4. Mutations ---

class UpdateAdminSettings(graphene.Mutation):
    """Mutation to update admin settings."""
    class Arguments:
        input = AdminSettingsInput(required=True)

    admin_settings = graphene.Field(AdminSettingsType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")

        user = info.context.user
        settings, created = AdminSettings.objects.get_or_create(user=user)

        # Update fields
        for field, value in input.items():
            if value is not None:
                setattr(settings, field, value)

        try:
            settings.save()
            return UpdateAdminSettings(
                admin_settings=settings,
                success=True,
                errors=[]
            )
        except Exception as e:
            return UpdateAdminSettings(
                admin_settings=settings,
                success=False,
                errors=[str(e)]
            )


class CreateSystemLog(graphene.Mutation):
    """Mutation to create a system log entry."""
    class Arguments:
        level = graphene.String(required=True)
        message = graphene.String(required=True)
        category = graphene.String()
        metadata = graphene.JSONString()

    system_log = graphene.Field(SystemLogType)
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, level, message, category='general', metadata=None):
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")

        log = SystemLog.objects.create(
            user=info.context.user,
            level=level,
            message=message,
            category=category,
            metadata=metadata or {},
            ip_address=getattr(info.context, 'META', {}).get('REMOTE_ADDR'),
            user_agent=getattr(info.context, 'META', {}).get('HTTP_USER_AGENT')
        )

        return CreateSystemLog(system_log=log, success=True)


class CreateBackup(graphene.Mutation):
    """Mutation to initiate a backup."""
    class Arguments:
        backup_type = graphene.String(required=True)

    backup_record = graphene.Field(BackupRecordType)
    success = graphene.Boolean()
    message = graphene.String()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, backup_type):
        if not info.context.user.is_authenticated:
            raise Exception("Authentication required")

        # Create backup record
        backup = BackupRecord.objects.create(
            backup_type=backup_type,
            status='pending',
            created_by=info.context.user
        )

        # Here you would typically trigger the actual backup process
        # For now, we'll just mark it as completed immediately
        backup.status = 'completed'
        backup.save()

        return CreateBackup(
            backup_record=backup,
            success=True,
            message="Backup completed successfully"
        )


# --- 5. Mutation Aggregation ---

class AdminDashboardMutation(graphene.ObjectType):
    """Mutations for admin dashboard functionality."""
    update_admin_settings = UpdateAdminSettings.Field()
    create_system_log = CreateSystemLog.Field()
    create_backup = CreateBackup.Field()