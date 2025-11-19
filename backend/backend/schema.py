# agency_app/schema.py

import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from inquiries.schema import InquiryQuery, InquiryMutation
from admin_dashboard.schema import AdminDashboardQuery, AdminDashboardMutation
from invoices_app.schema import InvoiceQuery, InvoiceMutation
from clients_app.schema import ClientQuery, ClientMutation
from projects_app.schema import ProjectQuery, ProjectMutation
from projects_app.models import Project
from time_logs_app.schema import TimeLogQuery, TimeLogMutation


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_superuser')


class ObtainJSONWebToken(graphql_jwt.ObtainJSONWebToken):
    """
    Custom ObtainJSONWebToken that enforces login only for the single 
    user defined by EXCLUSIVE_ADMIN_USERNAME, protecting the entire API.
    """
    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        username = kwargs.get('username')
        # password is also in kwargs, but we don't need to access it directly

        # 1. ENFORCE EXCLUSIVE LOGIN CHECK
        exclusive_username = getattr(settings, 'EXCLUSIVE_ADMIN_USERNAME', None)
        
        # Deny access if the provided username does not match the configured exclusive user
        if exclusive_username and username != exclusive_username:
            # Mask the error as "Invalid credentials" for security
            return cls(errors=['Invalid credentials'])

        # 2. Standard authentication process proceeds ONLY if the username matches
        user = authenticate(username=username, password=kwargs.get('password'))
        if user is None:
            return cls(errors=['Invalid credentials'])

        if not user.is_active:
            return cls(errors=['Account is disabled'])

        # 3. Generate token for the valid exclusive user
        return super().resolve_mutation(root, info, **kwargs)


class Query(ProjectQuery, InquiryQuery, AdminDashboardQuery, InvoiceQuery, ClientQuery, TimeLogQuery, graphene.ObjectType):
    # Resolve field conflicts by explicitly choosing which implementation to use
    # Use ClientQuery for client-related fields (more complete)
    all_clients = ClientQuery.all_clients
    client = ClientQuery.client

    # Use ProjectQuery for project-related fields (more complete)
    all_projects = ProjectQuery.all_projects
    all_management_projects = ProjectQuery.all_management_projects
    project = ProjectQuery.project

    # Explicitly include TimeLogQuery fields to ensure they are available
    all_time_logs = TimeLogQuery.all_time_logs
    time_log = TimeLogQuery.time_log
    time_log_entries = TimeLogQuery.time_log_entries
    time_log_analytics = TimeLogQuery.time_log_analytics

    # User field
    me = graphene.Field(UserType)

    @staticmethod
    def resolve_all_projects(root, info, status=None, client_id=None, phase=None, priority=None, is_active=None, limit=None, offset=None):
        # Public listing: unauthenticated users should see active projects only
        if not info.context.user.is_authenticated:
            queryset = Project.objects.filter(is_active=True)
        else:
            # Authenticated users see their own projects (management view)
            queryset = Project.objects.filter(user=info.context.user)

        if status:
            queryset = queryset.filter(status=status)
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if phase:
            queryset = queryset.filter(project_phase=phase)
        if priority:
            queryset = queryset.filter(priority=priority)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    def resolve_me(self, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None


class Mutation(InquiryMutation, AdminDashboardMutation, InvoiceMutation, ClientMutation, ProjectMutation, TimeLogMutation, graphene.ObjectType):
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)