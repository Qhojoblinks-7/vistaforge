# inquiries/schema.py

import graphene
import re
from graphene_django.types import DjangoObjectType
from django.db import transaction
from django.shortcuts import get_object_or_404
# NEW IMPORTS required for non-authenticated assignment logic
from django.contrib.auth.models import User
from django.conf import settings
from .models import Inquiry # Assumes Inquiry model is imported correctly
from typing import Dict, Any, List

# --- 0. RLS/Auth Mixin (Shared utility) ---
# This remains to protect all other sensitive endpoints
class LoginRequiredMixin:
    """A mixin to ensure the user is authenticated for a mutation."""
    @classmethod
    def mutate(cls, root, info, **kwargs):
        # This check will correctly fail for unauthenticated users 
        # accessing Update/Delete/BulkUpdate mutations.
        if not info.context.user or not info.context.user.is_authenticated:
            raise Exception("Authentication required. Only the sole administrator can perform this action.")
        return super().mutate(root, info, **kwargs)


# --- 1. Graphene Enum Definitions (Type-Safe Schema Validation) ---

def _choices_to_enum_dict(choices):
    """Convert Django-style choices into a dict suitable for graphene.Enum.
    
    Takes a list of (value, label) tuples and returns a dict of {NAME: value}
    where NAME is a valid GraphQL enum name (starts with letter/underscore,
    contains only alphanumeric and underscore).
    """
    mapping = {}
    for val, _label in choices:
        # Convert value to a valid GraphQL enum name
        key = str(val).upper()
        key = re.sub(r'[^0-9a-zA-Z_]', '_', key)
        if key[0].isdigit():
            key = f'V_{key}'
        # Ensure uniqueness
        orig_key = key
        counter = 1
        while key in mapping:
            key = f"{orig_key}_{counter}"
            counter += 1
        mapping[key] = val
    return mapping

# Create enums from choices
InquiryServiceEnum = graphene.Enum('InquiryServiceEnum', 
    _choices_to_enum_dict(Inquiry.SERVICE_CHOICES)
)

InquiryBudgetEnum = graphene.Enum('InquiryBudgetRangeEnum', 
    _choices_to_enum_dict(Inquiry.BUDGET_CHOICES)
)

InquiryTimelineEnum = graphene.Enum('InquiryTimelineEnum', 
    _choices_to_enum_dict(Inquiry.TIMELINE_CHOICES)
)

InquiryPriorityEnum = graphene.Enum('InquiryPriorityEnum', 
    _choices_to_enum_dict(Inquiry.PRIORITY_CHOICES)
)

InquiryStatusEnum = graphene.Enum('InquiryStatusEnum', 
    _choices_to_enum_dict(Inquiry.STATUS_CHOICES)
)

InquirySourceEnum = graphene.Enum('InquirySourceEnum', 
    _choices_to_enum_dict(Inquiry.SOURCE_CHOICES)
)


# --- 2. Inquiry Type (Simple DjangoObjectType) ---

class InquiryType(DjangoObjectType):
    """GraphQL Type definition for the Inquiry Model."""
    class Meta:
        model = Inquiry
        fields = '__all__'


# --- 3. Inquiry Query (RLS & N+1 Prevention) ---
# Note: Queries still require login (checked by resolve_all_inquiries/resolve_inquiry)

class InquiryQuery(graphene.ObjectType):
    all_inquiries = graphene.List(InquiryType)
    inquiry = graphene.Field(InquiryType, id=graphene.ID(required=True))

    @staticmethod
    def resolve_all_inquiries(root, info):
        if not info.context.user.is_authenticated:
            return Inquiry.objects.none()
        return Inquiry.objects.filter(user=info.context.user).select_related('user')

    @staticmethod
    def resolve_inquiry(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(
            Inquiry.objects.select_related('user'), pk=id, user=info.context.user
        )


# --- 4. Create Inquiry Mutation (UNAUTHENTICATED ACCESS) ---

class CreateInquiryInput(graphene.InputObjectType):
    """Input definition for creating a new Inquiry, using strings for enum fields."""
    client_name = graphene.String(required=True)
    client_email = graphene.String(required=True)
    client_phone = graphene.String(required=False)
    client_company = graphene.String(required=False)
    message = graphene.String(required=True)
    service_requested = graphene.String(required=False, default_value='OTHER')
    budget_range = graphene.String(required=False)
    timeline = graphene.String(required=False)
    priority = graphene.String(required=False, default_value='MEDIUM')
    source = graphene.String(required=False, default_value='WEBSITE')
    tags = graphene.List(graphene.String, required=False)


class CreateInquiry(graphene.Mutation): # LoginRequiredMixin REMOVED
    """Allows unauthenticated clients to send an inquiry, which is auto-assigned to the sole admin."""
    class Arguments:
        input = CreateInquiryInput(required=True)

    inquiry = graphene.Field(InquiryType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        # 1. Fetch the one and only exclusive user from settings
        exclusive_username = getattr(settings, 'EXCLUSIVE_ADMIN_USERNAME', None)
        
        if not exclusive_username:
             raise Exception("Configuration Error: EXCLUSIVE_ADMIN_USERNAME not set.")
             
        # Find the designated freelancer user to assign the inquiry to (user must exist)
        freelancer_user = get_object_or_404(User, username=exclusive_username)

        # 2. Prepare data, hard-assigning the user
        inquiry_data = {'user': freelancer_user, 'status': 'NEW'}

        # Unpack input values (enums are already strings from GraphQL)
        for field, value in input.items():
            if value is not None:
                inquiry_data[field] = value
            
        inquiry = Inquiry.objects.create(**inquiry_data)
        return CreateInquiry(inquiry=inquiry)


# --- 5. Update Inquiry Mutation (Protected by LoginRequiredMixin) ---

class UpdateInquiryInput(graphene.InputObjectType):
    # ... (remains the same)
    client_name = graphene.String(required=False)
    client_email = graphene.String(required=False)
    client_phone = graphene.String(required=False)
    client_company = graphene.String(required=False)
    message = graphene.String(required=False)
    service_requested = graphene.String(required=False)
    budget_range = graphene.String(required=False)
    timeline = graphene.String(required=False)
    priority = graphene.String(required=False)
    status = graphene.String(required=False)
    notes = graphene.String(required=False)
    follow_up_date = graphene.Date(required=False)
    source = graphene.String(required=False)
    tags = graphene.List(graphene.String, required=False)
    lead_score = graphene.Int(required=False)


class UpdateInquiry(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = UpdateInquiryInput(required=True)

    inquiry = graphene.Field(InquiryType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        
        inquiry = get_object_or_404(Inquiry.objects.filter(user=user), pk=id)
        
        update_data = {}
        for field, value in input.items():
            if value is not None:
                update_data[field] = value
        
        for field, value in update_data.items():
            setattr(inquiry, field, value)
            
        inquiry.save()
        return UpdateInquiry(inquiry=inquiry)


# --- 6. Bulk Update Mutation (Protected by LoginRequiredMixin) ---

class BulkUpdateInquiries(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        inquiry_ids = graphene.List(graphene.ID, required=True)
        status = graphene.String()
        priority = graphene.String()
        tags = graphene.List(graphene.String)

    success = graphene.Boolean()
    updated_count = graphene.Int()
    inquiries = graphene.List(InquiryType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, inquiry_ids, **kwargs):
        user = info.context.user

        inquiries_qs = Inquiry.objects.filter(id__in=inquiry_ids, user=user)

        if not inquiries_qs.exists():
            raise Exception("No inquiries found or you lack permission for the specified IDs.")

        update_data = {}
        for field, value in kwargs.items():
            if value is not None:
                update_data[field] = value

        updated_count = inquiries_qs.update(**update_data)

        updated_inquiries = Inquiry.objects.filter(id__in=inquiry_ids, user=user).select_related('user')

        return BulkUpdateInquiries(
            success=True,
            updated_count=updated_count,
            inquiries=list(updated_inquiries)
        )


# --- 7. Delete Inquiry (Protected by LoginRequiredMixin) ---

class DeleteInquiry(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user

        try:
            inquiry = Inquiry.objects.get(pk=id, user=user)
            inquiry.delete()
            return DeleteInquiry(success=True)
        except Inquiry.DoesNotExist:
            raise Exception("Inquiry not found or you lack permission.")


# --- 8. Convert to Client/Project Mutations ---

# Simple response types for the mutations
class ClientResponse(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    contact_email = graphene.String()
    status = graphene.String()
    total_revenue = graphene.Float()

class ProjectResponse(graphene.ObjectType):
    id = graphene.ID()
    title = graphene.String()
    status = graphene.String()
    project_rate = graphene.Float()
    due_date = graphene.Date()

class ConvertInquiryToClient(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        inquiry_id = graphene.ID(required=True)

    success = graphene.Boolean()
    client = graphene.Field(ClientResponse)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, inquiry_id):
        user = info.context.user

        inquiry = get_object_or_404(Inquiry.objects.filter(user=user), pk=inquiry_id)

        # For now, just return success since we don't have Client model
        # This is a placeholder that can be implemented when Client model exists

        # Update inquiry status
        inquiry.status = 'CONVERTED'
        inquiry.save()

        # Return mock client data
        client_data = {
            'id': f'client_{inquiry_id}',
            'name': inquiry.client_name,
            'contact_email': inquiry.client_email,
            'status': 'ACTIVE',
            'total_revenue': 0.0
        }

        return ConvertInquiryToClient(success=True, client=client_data)


class ConvertInquiryToProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        inquiry_id = graphene.ID(required=True)

    success = graphene.Boolean()
    project = graphene.Field(ProjectResponse)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, inquiry_id):
        user = info.context.user

        inquiry = get_object_or_404(Inquiry.objects.filter(user=user), pk=inquiry_id)

        # For now, just return success since we don't have Project model
        # This is a placeholder that can be implemented when Project model exists

        # Update inquiry status
        inquiry.status = 'CONVERTED'
        inquiry.save()

        # Return mock project data
        project_data = {
            'id': f'project_{inquiry_id}',
            'title': f"Project for {inquiry.client_name}",
            'status': 'PLANNING',
            'project_rate': 0.0,
            'due_date': None
        }

        return ConvertInquiryToProject(success=True, project=project_data)


# --- 9. Final Mutation Aggregation ---

class InquiryMutation(graphene.ObjectType):
    create_inquiry = CreateInquiry.Field()
    update_inquiry = UpdateInquiry.Field()
    bulk_update_inquiries = BulkUpdateInquiries.Field()
    delete_inquiry = DeleteInquiry.Field()
    convert_inquiry_to_client = ConvertInquiryToClient.Field()
    convert_inquiry_to_project = ConvertInquiryToProject.Field()