from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
import uuid

# Use the canonical Client model from clients_app to avoid duplicated model
# definitions that can break GraphQL type resolution.
# We reference the model via app label string in foreign keys to avoid import
# cycles during migrations.


class InvoiceProject(models.Model):
    """Project model for invoice association."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    # Reference the canonical Client model from clients_app using a string to
    # avoid circular imports and duplicated model classes. Use a unique
    # related_name to avoid clashing with the `projects_app.Project` relation.
    client = models.ForeignKey('clients_app.Client', on_delete=models.CASCADE, related_name='invoice_projects')
    title = models.CharField(max_length=200, help_text="Project title")
    description = models.TextField(blank=True, null=True, help_text="Project description")
    status = models.CharField(
        max_length=20,
        choices=[
            ('PLANNING', 'Planning'),
            ('IN_PROGRESS', 'In Progress'),
            ('COMPLETED', 'Completed'),
            ('ON_HOLD', 'On Hold'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='PLANNING',
        help_text="Project status"
    )
    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Project budget"
    )
    start_date = models.DateField(blank=True, null=True, help_text="Project start date")
    end_date = models.DateField(blank=True, null=True, help_text="Project end date")
    is_active = models.BooleanField(default=True, help_text="Whether project is active")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.client.name}"


class Invoice(models.Model):
    """Invoice model with comprehensive billing features."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')

    # Invoice identification
    invoice_number = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique invoice number"
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # Relationships
    # Use the canonical Client model from the clients_app
    client = models.ForeignKey('clients_app.Client', on_delete=models.CASCADE, related_name='invoices')
    project = models.ForeignKey(
        InvoiceProject,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='invoices'
    )

    # Dates
    issue_date = models.DateField(help_text="Invoice issue date")
    due_date = models.DateField(help_text="Payment due date")
    paid_date = models.DateField(blank=True, null=True, help_text="Date payment was received")

    # Status
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('CANCELLED', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        help_text="Invoice status"
    )

    # Financial calculations
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Subtotal before tax and discount"
    )
    tax = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Tax amount"
    )
    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Discount amount"
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total amount due"
    )

    # Additional information
    notes = models.TextField(blank=True, null=True, help_text="Invoice notes")

    # Relationship to time logs being billed (many-to-many)
    billed_time_logs = models.ManyToManyField('time_logs_app.TimeLog', blank=True, related_name='invoices', help_text="Time logs included in this invoice")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.invoice_number} - {self.client.name}"

    def save(self, *args, **kwargs):
        # Store old status for comparison
        old_status = None
        if self.pk:
            old_status = Invoice.objects.get(pk=self.pk).status

        # Auto-calculate total
        self.total = self.subtotal + self.tax - self.discount

        # Auto-update client total revenue when invoice becomes paid
        if old_status != 'PAID' and self.status == 'PAID':
            if not self.paid_date:
                self.paid_date = self.issue_date  # Use issue date if no paid date set
            self.client.total_revenue += self.total
            self.client.save()

        # Update client's outstanding balance
        self.update_client_balance()

        super().save(*args, **kwargs)

    def update_client_balance(self):
        """Update client's outstanding balance based on invoice status."""
        if self.status in ['SENT', 'OVERDUE']:
            # Add to outstanding balance
            self.client.outstanding_balance += self.total
        elif self.status == 'PAID':
            # Subtract from outstanding balance
            self.client.outstanding_balance -= self.total

        self.client.save()

    @property
    def is_overdue(self):
        """Check if invoice is overdue."""
        from django.utils import timezone
        return self.status in ['SENT', 'OVERDUE'] and self.due_date < timezone.now().date()

    @property
    def days_overdue(self):
        """Calculate days overdue."""
        from django.utils import timezone
        if self.is_overdue:
            return (timezone.now().date() - self.due_date).days
        return 0


class InvoiceItem(models.Model):
    """Individual line items on an invoice."""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=500, help_text="Item description")
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1,
        validators=[MinValueValidator(0.01)],
        help_text="Quantity of items"
    )
    rate = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Rate per unit"
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Total amount for this item"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Invoice Item"
        verbose_name_plural = "Invoice Items"
        ordering = ['created_at']

    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"

    def save(self, *args, **kwargs):
        # Auto-calculate amount
        self.amount = self.quantity * self.rate
        super().save(*args, **kwargs)
