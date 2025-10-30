import graphene
from graphene_django import DjangoObjectType
from django.db.models import QuerySet, Q
from typing import List, Optional
from django.contrib.auth import get_user_model

from .models import (
    Project, ProjectImage, ContactSubmission,
    MapMarker, Task, Milestone
)
from .decorators import superuser_only
from .types import ProjectType as PublicProjectType, ContactSubmissionType as PublicContactSubmissionType
from .mutations import ContactMutation

# Get the custom User model if applicable, otherwise default Django User
User = get_user_model()


class UserType(DjangoObjectType):
    """Graphene type for the Django User model."""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')


class ProjectImageType(DjangoObjectType):
    """Graphene type for project images."""
    class Meta:
        model = ProjectImage


class TaskType(DjangoObjectType):
    """Graphene type for project tasks."""
    class Meta:
        model = Task


class MilestoneType(DjangoObjectType):
    """Graphene type for project milestones."""
    class Meta:
        model = Milestone


class ProjectType(DjangoObjectType):
    """Graphene type mapping to the Django Project model."""
    # Custom fields for related data
    images = graphene.List(graphene.NonNull(ProjectImageType))
    tasks = graphene.List(graphene.NonNull(TaskType))
    milestones = graphene.List(graphene.NonNull(MilestoneType))
    design_tools_display = graphene.List(graphene.String)
    is_design_project = graphene.Boolean()

    class Meta:
        model = Project
        fields = (
            'id', 'name', 'slug', 'client_type', 'industry', 'intro', 'logo',
            'project_type', 'design_tools', 'starting_point', 'the_transformation',
            'journey_end', 'visuals', 'deliverables', 'design_system',
            'is_active', 'order', 'created_at', 'updated_at'
        )

    @staticmethod
    def resolve_images(root, info):
        """Resolve related project images."""
        return root.images.all()

    @staticmethod
    def resolve_tasks(root, info):
        """Resolve related project tasks."""
        return root.tasks.all()

    @staticmethod
    def resolve_milestones(root, info):
        """Resolve related project milestones."""
        return root.milestones.all()

    @staticmethod
    def resolve_design_tools_display(root, info):
        """Resolve formatted design tools display."""
        return root.get_design_tools_display()

    @staticmethod
    def resolve_is_design_project(root, info):
        """Resolve if this is a design project."""
        return root.is_design_project


class ContactSubmissionType(DjangoObjectType):
    """Graphene type for contact submissions."""
    class Meta:
        model = ContactSubmission
        fields = (
            'id', 'name', 'email', 'company', 'message', 'project_type',
            'budget_range', 'latitude', 'longitude', 'location_name',
            'ip_address', 'submitted_at', 'is_read', 'responded_at'
        )


class MapMarkerType(DjangoObjectType):
    """Graphene type for map markers."""
    class Meta:
        model = MapMarker
        fields = (
            'id', 'title', 'description', 'latitude', 'longitude',
            'location_name', 'marker_type', 'related_project',
            'related_contact', 'is_active', 'display_order',
            'created_at', 'updated_at'
        )


class PublicQuery(graphene.ObjectType):
    """Queries accessible to ANY user (public)."""

    # Public Query 1: List active projects
    allProjects = graphene.List(
        graphene.NonNull(PublicProjectType),
        required=True,
        description="Public list of completed and active portfolio projects."
    )

    def resolve_allProjects(root, info):
        # N+1 Optimized: Fetch related data for public view
        return Project.objects.filter(
            is_active=True
        ).order_by(
            '-created_at'
        )


class PrivateQuery(graphene.ObjectType):
    """Queries accessible ONLY to the authorized superuser."""

    # Private Query 1: Full list of all projects (including inactive)
    allManagementProjects = graphene.List(graphene.NonNull(ProjectType), required=True)

    # Private Query 2: All contact messages
    allContacts = graphene.List(graphene.NonNull(PublicContactSubmissionType), required=True)

    @superuser_only # CRITICAL SECURITY ENFORCEMENT
    def resolve_allManagementProjects(root, info):
        # The superuser can see all projects
        return Project.objects.select_related().prefetch_related(
            'images', 'tasks', 'milestones'
        ).all()

    @superuser_only # CRITICAL SECURITY ENFORCEMENT
    def resolve_allContacts(root, info):
        # Only the superuser can view the client submissions
        return ContactSubmission.objects.order_by('-submitted_at').all()


class Query(PublicQuery, PrivateQuery, graphene.ObjectType):
    """Merges public and private queries under a single root."""
    pass

# Export the schema
schema = graphene.Schema(query=Query)