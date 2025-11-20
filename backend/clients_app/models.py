from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone


class Client(models.Model):
    """Client model for managing client relationships and billing."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients_app_clients')

    # Basic Information
    name = models.CharField(max_length=100, help_text="Client full name")
    company = models.CharField(max_length=100, blank=True, null=True, help_text="Company name")
    contact_email = models.EmailField(help_text="Primary contact email")
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Contact phone number")
    address = models.TextField(blank=True, null=True, help_text="Billing address")

    # Status
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('ARCHIVED', 'Archived'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        help_text="Client status"
    )

    # Financial Information
    total_revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total revenue from this client"
    )
    outstanding_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Current outstanding balance"
    )

    # Additional Information
    notes = models.TextField(blank=True, null=True, help_text="Internal notes about the client")
    website = models.URLField(blank=True, null=True, help_text="Client website")
    industry = models.CharField(max_length=100, blank=True, null=True, help_text="Industry/sector")

    # Contact Information
    secondary_email = models.EmailField(blank=True, null=True, help_text="Secondary contact email")
    secondary_phone = models.CharField(max_length=20, blank=True, null=True, help_text="Secondary phone number")

    # Business Information
    tax_id = models.CharField(max_length=50, blank=True, null=True, help_text="Tax ID or VAT number")
    payment_terms = models.CharField(
        max_length=50,
        default='Net 30',
        help_text="Payment terms (e.g., Net 30, Net 15)"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.company or 'Individual'})"

    @property
    def total_projects(self):
        """Get total number of projects for this client."""
        from projects_app.models import Project
        return Project.objects.filter(client=self).count()

    @property
    def active_projects(self):
        """Get number of active projects for this client."""
        from projects_app.models import Project
        return Project.objects.filter(client=self, status='IN_PROGRESS').count()

    @property
    def total_invoices(self):
        """Get total number of invoices for this client."""
        from invoices_app.models import Invoice
        return Invoice.objects.filter(client=self).count()

    @property
    def paid_invoices(self):
        """Get number of paid invoices for this client."""
        from invoices_app.models import Invoice
        return Invoice.objects.filter(client=self, status='PAID').count()

    @property
    def overdue_invoices(self):
        """Get number of overdue invoices for this client."""
        from invoices_app.models import Invoice
        return Invoice.objects.filter(
            client=self,
            status__in=['SENT', 'OVERDUE'],
            due_date__lt=timezone.now().date()
        ).count()

    def update_financial_totals(self):
        """Update client's total revenue and outstanding balance based on invoices."""
        from invoices_app.models import Invoice
        from time_logs_app.models import TimeLog

        # Calculate total revenue from paid invoices
        paid_invoices = Invoice.objects.filter(client=self, status='PAID')
        self.total_revenue = sum(invoice.total for invoice in paid_invoices)

        # Calculate outstanding balance from unpaid invoices
        unpaid_invoices = Invoice.objects.filter(
            client=self,
            status__in=['SENT', 'OVERDUE']
        )
        self.outstanding_balance = sum(invoice.total for invoice in unpaid_invoices)

        self.save()

    def save(self, *args, **kwargs):
        # Avoid infinite recursion by checking if we're already updating
        if hasattr(self, '_updating_totals'):
            super().save(*args, **kwargs)
            return

        super().save(*args, **kwargs)
        # Update financial totals whenever client is saved
        self._updating_totals = True
        try:
            self.update_financial_totals()
        finally:
            delattr(self, '_updating_totals')


class ClientContact(models.Model):
    """Additional contacts for a client."""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=100, help_text="Contact person's name")
    title = models.CharField(max_length=100, blank=True, null=True, help_text="Job title")
    email = models.EmailField(help_text="Contact email")
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Contact phone")
    is_primary = models.BooleanField(default=False, help_text="Is this the primary contact?")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Client Contact"
        verbose_name_plural = "Client Contacts"
        ordering = ['-is_primary', 'name']

    def __str__(self):
        return f"{self.name} - {self.client.name}"

    def save(self, *args, **kwargs):
        # Ensure only one primary contact per client
        if self.is_primary:
            ClientContact.objects.filter(client=self.client).update(is_primary=False)
        super().save(*args, **kwargs)


class ClientNote(models.Model):
    """Notes and communication history for clients."""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_notes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who created the note")

    # Relationship to inquiry if note originated from an inquiry
    inquiry = models.ForeignKey('inquiries.Inquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='client_notes')

    NOTE_TYPE_CHOICES = [
        ('GENERAL', 'General Note'),
        ('MEETING', 'Meeting Notes'),
        ('CALL', 'Phone Call'),
        ('EMAIL', 'Email Communication'),
        ('FOLLOW_UP', 'Follow-up Required'),
    ]
    note_type = models.CharField(
        max_length=20,
        choices=NOTE_TYPE_CHOICES,
        default='GENERAL',
        help_text="Type of note"
    )

    title = models.CharField(max_length=200, help_text="Note title")
    content = models.TextField(help_text="Note content")

    # Follow-up information
    follow_up_required = models.BooleanField(default=False, help_text="Does this require follow-up?")
    follow_up_date = models.DateField(blank=True, null=True, help_text="Follow-up date")
    follow_up_completed = models.BooleanField(default=False, help_text="Has follow-up been completed?")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Client Note"
        verbose_name_plural = "Client Notes"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.client.name}"
