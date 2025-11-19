import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.conf import settings
from .models import Client, ClientContact, ClientNote
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
class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        fields = ('id', 'name', 'company', 'contact_email', 'phone', 'address', 'status', 'total_revenue', 'outstanding_balance', 'notes', 'created_at', 'updated_at')

    # Add computed fields
    totalProjects = graphene.Int()
    activeProjects = graphene.Int()
    totalInvoices = graphene.Int()
    paidInvoices = graphene.Int()
    overdueInvoices = graphene.Int()
    totalRevenue = graphene.Float()
    outstandingBalance = graphene.Float()

    def resolve_totalProjects(self, info):
        return self.total_projects

    def resolve_activeProjects(self, info):
        return self.active_projects

    def resolve_totalInvoices(self, info):
        return self.total_invoices

    def resolve_paidInvoices(self, info):
        return self.paid_invoices

    def resolve_overdueInvoices(self, info):
        return self.overdue_invoices

    def resolve_totalRevenue(self, info):
        return float(self.total_revenue)

    def resolve_outstandingBalance(self, info):
        return float(self.outstanding_balance)


class ClientContactType(DjangoObjectType):
    class Meta:
        model = ClientContact
        fields = '__all__'


class ClientNoteType(DjangoObjectType):
    class Meta:
        model = ClientNote
        fields = '__all__'


# --- Input Types ---
class ClientContactInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    title = graphene.String()
    email = graphene.String(required=True)
    phone = graphene.String()
    is_primary = graphene.Boolean()


class ClientNoteInput(graphene.InputObjectType):
    note_type = graphene.String(required=True)
    title = graphene.String(required=True)
    content = graphene.String(required=True)
    follow_up_required = graphene.Boolean()
    follow_up_date = graphene.Date()


class ClientInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    company = graphene.String()
    contact_email = graphene.String(required=True)
    phone = graphene.String()
    address = graphene.String()
    website = graphene.String()
    industry = graphene.String()
    secondary_email = graphene.String()
    secondary_phone = graphene.String()
    tax_id = graphene.String()
    payment_terms = graphene.String()
    notes = graphene.String()


# --- Queries ---
class ClientQuery(graphene.ObjectType):
    # Clients
    all_clients = graphene.List(
        ClientType,
        status=graphene.String(),
        search=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    client = graphene.Field(ClientType, id=graphene.ID(required=True))

    # Client contacts and notes
    client_contacts = graphene.List(ClientContactType, client_id=graphene.ID(required=True))
    client_notes = graphene.List(ClientNoteType, client_id=graphene.ID(required=True))

    # Analytics
    client_analytics = graphene.Field(graphene.String)

    @staticmethod
    def resolve_all_clients(root, info, status=None, search=None, limit=None, offset=None):
        if not info.context.user.is_authenticated:
            return Client.objects.none()

        queryset = Client.objects.filter(user=info.context.user)

        if status:
            queryset = queryset.filter(status=status)

        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(company__icontains=search) |
                models.Q(contact_email__icontains=search)
            )

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    @staticmethod
    def resolve_client(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(Client, pk=id, user=info.context.user)

    @staticmethod
    def resolve_client_contacts(root, info, client_id):
        if not info.context.user.is_authenticated:
            return ClientContact.objects.none()
        return ClientContact.objects.filter(client_id=client_id, client__user=info.context.user)

    @staticmethod
    def resolve_client_notes(root, info, client_id):
        if not info.context.user.is_authenticated:
            return ClientNote.objects.none()
        return ClientNote.objects.filter(client_id=client_id, client__user=info.context.user)

    @staticmethod
    def resolve_client_analytics(root, info):
        if not info.context.user.is_authenticated:
            return "{}"

        clients = Client.objects.filter(user=info.context.user)

        total_clients = clients.count()
        active_clients = clients.filter(status='ACTIVE').count()
        total_revenue = sum(float(client.total_revenue) for client in clients)
        outstanding_balance = sum(float(client.outstanding_balance) for client in clients)

        import json
        return json.dumps({
            'totalClients': total_clients,
            'activeClients': active_clients,
            'totalRevenue': total_revenue,
            'outstandingBalance': outstanding_balance,
        })


# --- Mutations ---
class CreateClient(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = ClientInput(required=True)

    client = graphene.Field(ClientType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user
        client = Client.objects.create(user=user, **input)
        return CreateClient(client=client)


class UpdateClient(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ClientInput(required=True)

    client = graphene.Field(ClientType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        client = get_object_or_404(Client, pk=id, user=user)

        for field, value in input.items():
            setattr(client, field, value)
        client.save()

        return UpdateClient(client=client)


class DeleteClient(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        client = get_object_or_404(Client, pk=id, user=user)
        client.delete()
        return DeleteClient(success=True)


class CreateClientContact(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        client_id = graphene.ID(required=True)
        input = ClientContactInput(required=True)

    contact = graphene.Field(ClientContactType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, client_id, input):
        user = info.context.user
        client = get_object_or_404(Client, pk=client_id, user=user)

        contact = ClientContact.objects.create(client=client, **input)
        return CreateClientContact(contact=contact)


class UpdateClientContact(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ClientContactInput(required=True)

    contact = graphene.Field(ClientContactType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        contact = get_object_or_404(ClientContact, pk=id, client__user=user)

        for field, value in input.items():
            setattr(contact, field, value)
        contact.save()

        return UpdateClientContact(contact=contact)


class DeleteClientContact(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        contact = get_object_or_404(ClientContact, pk=id, client__user=user)
        contact.delete()
        return DeleteClientContact(success=True)


class CreateClientNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        client_id = graphene.ID(required=True)
        input = ClientNoteInput(required=True)

    note = graphene.Field(ClientNoteType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, client_id, input):
        user = info.context.user
        client = get_object_or_404(Client, pk=client_id, user=user)

        note = ClientNote.objects.create(client=client, user=user, **input)
        return CreateClientNote(note=note)


class UpdateClientNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ClientNoteInput(required=True)

    note = graphene.Field(ClientNoteType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        note = get_object_or_404(ClientNote, pk=id, client__user=user)

        for field, value in input.items():
            setattr(note, field, value)
        note.save()

        return UpdateClientNote(note=note)


class DeleteClientNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        note = get_object_or_404(ClientNote, pk=id, client__user=user)
        note.delete()
        return DeleteClientNote(success=True)


# --- Mutation Aggregation ---
class ClientMutation(graphene.ObjectType):
    # Client mutations
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    delete_client = DeleteClient.Field()

    # Client contact mutations
    create_client_contact = CreateClientContact.Field()
    update_client_contact = UpdateClientContact.Field()
    delete_client_contact = DeleteClientContact.Field()

    # Client note mutations
    create_client_note = CreateClientNote.Field()
    update_client_note = UpdateClientNote.Field()
    delete_client_note = DeleteClientNote.Field()