import graphene
from graphene_django import DjangoObjectType
from .models import Project, ContactSubmission

class ProjectType(DjangoObjectType):
    """Public type for displaying portfolio projects."""
    class Meta:
        model = Project
        # Expose only public, client-facing fields
        fields = ('id', 'name', 'slug', 'intro', 'created_at')

class ContactSubmissionType(DjangoObjectType):
    """Type for representing client contact submissions."""
    class Meta:
        model = ContactSubmission
        fields = ('id', 'name', 'email', 'message', 'submitted_at')