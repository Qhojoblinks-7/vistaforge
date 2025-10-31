import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from projects.schema import Query as ProjectsQuery
from projects.models import ContactSubmission
from projects.utils import send_contact_notification, send_project_inquiry_notification
from projects.mutations import ContactMutation, CreateProjectMutation, UpdateProjectMutation, DeleteProjectMutation


class UserType(DjangoObjectType):
    """Graphene type for the Django User model."""
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')


class ContactSubmissionInput(graphene.InputObjectType):
    """Input type for contact form submissions."""
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    company = graphene.String()
    message = graphene.String(required=True)
    project_type = graphene.String()
    budget_range = graphene.String()
    latitude = graphene.Float()
    longitude = graphene.Float()
    location_name = graphene.String()


class AuthMutation(graphene.ObjectType):
    """Authentication mutations."""
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


# Use the new ContactMutation from projects.mutations


class Mutation(AuthMutation, graphene.ObjectType):
    """Aggregates all Mutations (Public and Private)."""

    # PUBLIC mutation, no decorator needed on the field
    submit_contact = ContactMutation.Field()

    # Private mutations (admin only)
    create_project = CreateProjectMutation.Field()
    update_project = UpdateProjectMutation.Field()
    delete_project = DeleteProjectMutation.Field()


class Query(ProjectsQuery, graphene.ObjectType):
    """Root query combining all queries."""
    pass


# Create the main schema
schema = graphene.Schema(query=Query, mutation=Mutation)