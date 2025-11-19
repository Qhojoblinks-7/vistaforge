import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.conf import settings
from .models import InvoiceProject, Invoice, InvoiceItem
from clients_app.models import Client as ClientsAppClient
from clients_app.schema import ClientType
from typing import Dict, Any, List
from decimal import Decimal
from django.utils import timezone


# --- Authentication Mixin ---
class LoginRequiredMixin:
    """A mixin to ensure the user is authenticated for sensitive operations."""
    @classmethod
    def mutate(cls, root, info, **kwargs):
        if not info.context.user or not info.context.user.is_authenticated:
            raise Exception("Authentication required.")
        return super().mutate(root, info, **kwargs)


class InvoiceProjectType(DjangoObjectType):
    class Meta:
        model = InvoiceProject
        fields = '__all__'


class InvoiceItemType(DjangoObjectType):
    class Meta:
        model = InvoiceItem
        fields = '__all__'


class InvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        fields = '__all__'


# --- Input Types ---
class ClientInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    company = graphene.String()
    contact_email = graphene.String(required=True)
    phone = graphene.String()
    address = graphene.String()
    notes = graphene.String()


class ProjectInput(graphene.InputObjectType):
    client_id = graphene.ID(required=True)
    title = graphene.String(required=True)
    description = graphene.String()
    status = graphene.String()
    budget = graphene.Decimal()
    start_date = graphene.Date()
    end_date = graphene.Date()
    is_active = graphene.Boolean()


class InvoiceItemInput(graphene.InputObjectType):
    # Accept both camelCase and snake_case field names from frontend
    description = graphene.String(required=True)
    quantity = graphene.Decimal(required=True)
    rate = graphene.Decimal(required=True)
    # Frontend may include amount (computed client-side) — we accept but ignore
    amount = graphene.Decimal()


class InvoiceInput(graphene.InputObjectType):
    # Accept both snake_case and camelCase keys to match frontend payloads
    client_id = graphene.ID()
    clientId = graphene.ID()
    project_id = graphene.ID()
    projectId = graphene.ID()
    invoice_number = graphene.String()
    invoiceNumber = graphene.String()
    issue_date = graphene.Date()
    issueDate = graphene.Date()
    due_date = graphene.Date()
    dueDate = graphene.Date()
    notes = graphene.String()
    items = graphene.List(InvoiceItemInput)
    # Financial fields (frontend may send amounts already calculated)
    subtotal = graphene.Decimal()
    tax = graphene.Decimal()
    discount = graphene.Decimal()
    total = graphene.Decimal()
    status = graphene.String()


# --- Queries ---
class InvoiceQuery(graphene.ObjectType):
    # Clients
    all_clients = graphene.List(ClientType)
    client = graphene.Field(ClientType, id=graphene.ID(required=True))

    # Projects
    all_projects = graphene.List(InvoiceProjectType)
    project = graphene.Field(InvoiceProjectType, id=graphene.ID(required=True))

    # Invoices
    all_invoices = graphene.List(
        InvoiceType,
        status=graphene.String(),
        client_id=graphene.ID(),
        project_id=graphene.ID(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    invoice = graphene.Field(InvoiceType, id=graphene.ID(required=True))

    # Analytics
    invoice_analytics = graphene.Field(graphene.JSONString)

    @staticmethod
    def resolve_all_clients(root, info):
        if not info.context.user.is_authenticated:
            return ClientsAppClient.objects.none()
        return ClientsAppClient.objects.filter(user=info.context.user)

    @staticmethod
    def resolve_client(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(ClientsAppClient, pk=id, user=info.context.user)

    @staticmethod
    def resolve_all_projects(root, info):
        if not info.context.user.is_authenticated:
            return InvoiceProject.objects.none()
        return InvoiceProject.objects.filter(user=info.context.user).select_related('client')

    @staticmethod
    def resolve_project(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(
            InvoiceProject.objects.select_related('client'),
            pk=id,
            user=info.context.user
        )

    @staticmethod
    def resolve_all_invoices(root, info, status=None, client_id=None, project_id=None, limit=None, offset=None):
        if not info.context.user.is_authenticated:
            return Invoice.objects.none()

        queryset = Invoice.objects.filter(user=info.context.user).select_related('client', 'project')

        if status:
            queryset = queryset.filter(status=status)
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    @staticmethod
    def resolve_invoice(root, info, id):
        if not info.context.user.is_authenticated:
            return None
        return get_object_or_404(
            Invoice.objects.select_related('client', 'project').prefetch_related('items'),
            pk=id,
            user=info.context.user
        )

    @staticmethod
    def resolve_invoice_analytics(root, info):
        if not info.context.user.is_authenticated:
            return {}

        invoices = Invoice.objects.filter(user=info.context.user)

        total_revenue = sum(invoice.total for invoice in invoices.filter(status='PAID'))
        pending_amount = sum(invoice.total for invoice in invoices.filter(status__in=['SENT', 'DRAFT']))
        paid_amount = total_revenue
        overdue_amount = sum(invoice.total for invoice in invoices.filter(status='OVERDUE'))

        total_invoices = invoices.count()
        paid_invoices = invoices.filter(status='PAID').count()
        pending_invoices = invoices.filter(status__in=['SENT', 'DRAFT']).count()
        overdue_invoices = invoices.filter(status='OVERDUE').count()

        return {
            'totalRevenue': float(total_revenue),
            'pendingAmount': float(pending_amount),
            'paidAmount': float(paid_amount),
            'overdueAmount': float(overdue_amount),
            'totalInvoices': total_invoices,
            'paidInvoices': paid_invoices,
            'pendingInvoices': pending_invoices,
            'overdueInvoices': overdue_invoices,
        }


# --- Mutations ---
class CreateClient(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = ClientInput(required=True)

    client = graphene.Field(ClientType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user
        client = ClientsAppClient.objects.create(user=user, **input)
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
        client = get_object_or_404(ClientsAppClient, pk=id, user=user)

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
        client = get_object_or_404(ClientsAppClient, pk=id, user=user)
        client.delete()
        return DeleteClient(success=True)


class CreateProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = ProjectInput(required=True)

    project = graphene.Field(InvoiceProjectType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user
        client_id = input.pop('client_id')
        client = get_object_or_404(ClientsAppClient, pk=client_id, user=user)

        project = InvoiceProject.objects.create(user=user, client=client, **input)
        return CreateProject(project=project)


class UpdateProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectInput(required=True)

    project = graphene.Field(InvoiceProjectType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        project = get_object_or_404(InvoiceProject, pk=id, user=user)

        client_id = input.pop('client_id', None)
        if client_id:
            client = get_object_or_404(ClientsAppClient, pk=client_id, user=user)
            project.client = client

        for field, value in input.items():
            setattr(project, field, value)
        project.save()

        return UpdateProject(project=project)


class DeleteProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        project = get_object_or_404(InvoiceProject, pk=id, user=user)
        project.delete()
        return DeleteProject(success=True)


class CreateInvoice(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = InvoiceInput(required=True)

    invoice = graphene.Field(InvoiceType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user

        # Support both camelCase and snake_case keys
        client_id = input.pop('client_id', None) or input.pop('clientId', None)
        project_id = input.pop('project_id', None) or input.pop('projectId', None)
        invoice_number = input.pop('invoice_number', None) or input.pop('invoiceNumber', None)
        issue_date = input.pop('issue_date', None) or input.pop('issueDate', None)
        due_date = input.pop('due_date', None) or input.pop('dueDate', None)
        items_data = input.pop('items', []) or []

        # Financial fields (frontend may send these pre-calculated)
        tax_amount = input.pop('tax', None)
        discount_amount = input.pop('discount', None)
        subtotal_amount = input.pop('subtotal', None)
        total_amount = input.pop('total', None)
        status = input.pop('status', None)

        if not client_id:
            raise Exception('client_id is required')

        client = get_object_or_404(ClientsAppClient, pk=client_id, user=user)
        project = None
        if project_id:
            project = get_object_or_404(InvoiceProject, pk=project_id, user=user)

        # Generate invoice number if not provided
        if not invoice_number:
            invoice_number = f"INV{timezone.now().strftime('%Y%m%d%H%M%S')}"

        # Normalize status to backend choices (uppercase)
        if status:
            status = status.upper()
        else:
            status = 'DRAFT'

        # Create invoice record (use provided dates if available)
        invoice = Invoice.objects.create(
            user=user,
            client=client,
            project=project,
            invoice_number=invoice_number,
            issue_date=issue_date or timezone.now().date(),
            due_date=due_date or timezone.now().date(),
            notes=input.pop('notes', None),
            status=status,
        )

        # Create invoice items and compute subtotal
        subtotal = Decimal('0')
        for item_data in items_data:
            # Only pick allowed fields to avoid unexpected kwargs (like id or amount)
            description = item_data.get('description')
            quantity = Decimal(str(item_data.get('quantity') or item_data.get('qty') or 0))
            rate = Decimal(str(item_data.get('rate') or 0))
            item = InvoiceItem.objects.create(
                invoice=invoice,
                description=description,
                quantity=quantity,
                rate=rate
            )
            subtotal += item.amount

        # Use provided financials if present, otherwise compute
        if subtotal_amount is None:
            invoice.subtotal = subtotal
        else:
            invoice.subtotal = Decimal(str(subtotal_amount))

        invoice.tax = Decimal(str(tax_amount)) if tax_amount is not None else Decimal('0')
        invoice.discount = Decimal(str(discount_amount)) if discount_amount is not None else Decimal('0')

        # Final total: prefer provided total_amount, otherwise compute
        if total_amount is not None:
            invoice.total = Decimal(str(total_amount))
        else:
            invoice.total = invoice.subtotal + invoice.tax - invoice.discount

        invoice.save()

        return CreateInvoice(invoice=invoice)


class UpdateInvoice(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = InvoiceInput(required=True)

    invoice = graphene.Field(InvoiceType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        invoice = get_object_or_404(Invoice, pk=id, user=user)

        # Support both camelCase and snake_case keys
        client_id = input.pop('client_id', None) or input.pop('clientId', None)
        project_id = input.pop('project_id', None) or input.pop('projectId', None)
        items_data = input.pop('items', None)

        if client_id:
            client = get_object_or_404(ClientsAppClient, pk=client_id, user=user)
            invoice.client = client

        if project_id:
            project = get_object_or_404(InvoiceProject, pk=project_id, user=user)
            invoice.project = project
        elif 'project_id' in input or 'projectId' in input:
            # Explicitly set to None when frontend sends null/empty
            invoice.project = None

        # Normalize and apply status if provided
        status = input.pop('status', None)
        if status is not None:
            invoice.status = status.upper()

        # Apply simple scalar fields (notes, dates) using known names
        if 'notes' in input:
            invoice.notes = input.get('notes')
        if 'issue_date' in input or 'issueDate' in input:
            invoice.issue_date = input.get('issue_date') or input.get('issueDate')
        if 'due_date' in input or 'dueDate' in input:
            invoice.due_date = input.get('due_date') or input.get('dueDate')

        # Financial fields if provided
        tax_amount = input.pop('tax', None)
        discount_amount = input.pop('discount', None)
        subtotal_amount = input.pop('subtotal', None)
        total_amount = input.pop('total', None)

        if tax_amount is not None:
            invoice.tax = Decimal(str(tax_amount))
        if discount_amount is not None:
            invoice.discount = Decimal(str(discount_amount))
        if subtotal_amount is not None:
            invoice.subtotal = Decimal(str(subtotal_amount))

        # Update items if provided
        if items_data is not None:
            # Delete existing items
            invoice.items.all().delete()

            # Create new items and compute subtotal
            subtotal = Decimal('0')
            for item_data in items_data:
                description = item_data.get('description')
                quantity = Decimal(str(item_data.get('quantity') or item_data.get('qty') or 0))
                rate = Decimal(str(item_data.get('rate') or 0))
                item = InvoiceItem.objects.create(
                    invoice=invoice,
                    description=description,
                    quantity=quantity,
                    rate=rate
                )
                subtotal += item.amount

            invoice.subtotal = subtotal

        # Final total: prefer provided total_amount, otherwise compute
        if total_amount is not None:
            invoice.total = Decimal(str(total_amount))
        else:
            invoice.total = invoice.subtotal + invoice.tax - invoice.discount

        invoice.save()
        return UpdateInvoice(invoice=invoice)


class DeleteInvoice(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        invoice = get_object_or_404(Invoice, pk=id, user=user)
        invoice.delete()
        return DeleteInvoice(success=True)


class SendInvoice(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        email_data = graphene.JSONString()

    success = graphene.Boolean()
    invoice = graphene.Field(InvoiceType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, email_data=None):
        user = info.context.user
        invoice = get_object_or_404(Invoice, pk=id, user=user)

        # Update status to sent
        invoice.status = 'SENT'
        invoice.save()

        # TODO: Implement actual email sending logic here
        # For now, just mark as sent

        return SendInvoice(success=True, invoice=invoice)


class MarkInvoicePaid(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        payment_data = graphene.JSONString()

    success = graphene.Boolean()
    invoice = graphene.Field(InvoiceType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, payment_data=None):
        user = info.context.user
        invoice = get_object_or_404(Invoice, pk=id, user=user)

        # Update status and payment date
        from django.utils import timezone
        invoice.status = 'PAID'
        invoice.paid_date = timezone.now().date()
        invoice.save()

        return MarkInvoicePaid(success=True, invoice=invoice)


# --- Mutation Aggregation ---
class InvoiceMutation(graphene.ObjectType):
    # Client mutations
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    delete_client = DeleteClient.Field()

    # Project mutations
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()

    # Invoice mutations
    create_invoice = CreateInvoice.Field()
    update_invoice = UpdateInvoice.Field()
    delete_invoice = DeleteInvoice.Field()
    send_invoice = SendInvoice.Field()
    mark_invoice_paid = MarkInvoicePaid.Field()