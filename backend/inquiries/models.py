from django.db import models
from django.contrib.auth.models import User


class Inquiry(models.Model):
    # RLS Field: Links the inquiry to the freelancer user
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Relationship to client when inquiry is converted
    converted_client = models.ForeignKey('clients_app.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='converted_from_inquiries')

    # Core Contact Fields
    client_name = models.CharField(max_length=150, help_text="Name of the person making the inquiry.")
    client_email = models.EmailField(max_length=254)
    client_phone = models.CharField(max_length=20, blank=True, null=True, help_text="Phone number for follow-up")
    client_company = models.CharField(max_length=100, blank=True, null=True, help_text="Company/organization name")

    # Inquiry Details
    message = models.TextField(help_text="Client's inquiry message")

    # Service & Budget Info (Essential for freelancers)
    SERVICE_CHOICES = [
        ('WEB_DEV', 'Web Development'),
        ('WEB_DESIGN', 'Web Design'),
        ('MOBILE_APP', 'Mobile App Development'),
        ('BRANDING', 'Branding & Logo Design'),
        ('UI_UX', 'UI/UX Design'),
        ('SEO', 'SEO & Digital Marketing'),
        ('CONSULTING', 'Technical Consulting'),
        ('MAINTENANCE', 'Website Maintenance'),
        ('OTHER', 'Other Services'),
    ]
    service_requested = models.CharField(max_length=15, choices=SERVICE_CHOICES, default='OTHER')

    BUDGET_CHOICES = [
        ('UNDER_1K', 'Under $1,000'),
        ('SMALL_1K_5K', '$1,000 - $5,000'),
        ('MID_5K_10K', '$5,000 - $10,000'),
        ('MID_10K_25K', '$10,000 - $25,000'),
        ('LARGE_25K_50K', '$25,000 - $50,000'),
        ('OVER_50K', 'Over $50,000'),
        ('DISCUSS', 'To be discussed'),
    ]
    budget_range = models.CharField(max_length=15, choices=BUDGET_CHOICES, blank=True, null=True)

    # Timeline
    TIMELINE_CHOICES = [
        ('ASAP', 'ASAP'),
        ('WEEK_ONE', 'Within 1 week'),
        ('WEEKS_TWO', 'Within 2 weeks'),
        ('MONTH_ONE', 'Within 1 month'),
        ('MONTHS_THREE', 'Within 3 months'),
        ('FLEXIBLE', 'Flexible timeline'),
    ]
    timeline = models.CharField(max_length=15, choices=TIMELINE_CHOICES, blank=True, null=True)

    # Priority for freelancer workflow
    PRIORITY_CHOICES = [
        ('HIGH', 'High Priority'),
        ('MEDIUM', 'Medium Priority'),
        ('LOW', 'Low Priority'),
    ]
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='MEDIUM')

    # Status Management (Simplified for solo freelancer)
    STATUS_CHOICES = [
        ('NEW', 'New Inquiry'),
        ('CONTACTED', 'Contacted Client'),
        ('QUOTED', 'Quote Sent'),
        ('NEGOTIATING', 'Negotiating'),
        ('WON', 'Project Won'),
        ('LOST', 'Project Lost'),
        ('ON_HOLD', 'On Hold'),
    ]
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='NEW')

    # Follow-up and notes
    notes = models.TextField(blank=True, null=True, help_text="Internal notes and follow-up details")
    follow_up_date = models.DateField(blank=True, null=True, help_text="Next follow-up date")
    reminder_sent = models.BooleanField(default=False, help_text="Whether follow-up reminder has been sent")

    # Tags for organization
    tags = models.JSONField(default=list, help_text="List of tags for organizing inquiries")

    # Lead scoring (calculated field)
    lead_score = models.IntegerField(default=0, help_text="Calculated lead score (0-100)")

    # Source tracking
    SOURCE_CHOICES = [
        ('WEBSITE', 'Website Contact Form'),
        ('EMAIL', 'Direct Email'),
        ('LINKEDIN', 'LinkedIn'),
        ('UPWORK', 'Upwork/Freelance Platform'),
        ('REFERRAL', 'Referral'),
        ('SOCIAL', 'Social Media'),
        ('OTHER', 'Other'),
    ]
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='WEBSITE')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} - {self.service_requested} ({self.status})"

    def convert_to_client(self):
        """Convert inquiry to a client record."""
        from clients_app.models import Client

        client, created = Client.objects.get_or_create(
            user=self.user,
            contact_email=self.client_email,
            defaults={
                'name': self.client_name,
                'company': self.client_company,
                'phone': self.client_phone,
                'notes': f"Converted from inquiry: {self.message[:200]}..."
            }
        )

        # Link inquiry to client
        self.converted_client = client
        # Update inquiry status
        self.status = 'WON'
        self.save()

        return client

    def convert_to_project(self, client=None):
        """Convert inquiry to a project."""
        from projects_app.models import Project

        if not client:
            client = self.convert_to_client()

        # Create project from inquiry data
        project = Project.objects.create(
            user=self.user,
            client=client,
            inquiry=self,  # Link to the inquiry
            title=f"{self.service_requested.replace('_', ' ').title()} Project",
            description=f"Inquiry: {self.message}",
            status='PLANNING',
            budget=self.get_budget_amount(),
            hourly_rate=50.00,  # Default rate, can be adjusted
            estimated_hours=self.get_estimated_hours(),
            priority=self.priority.lower(),
            is_active=True
        )

        return project

    def get_budget_amount(self):
        """Convert budget range to numeric value."""
        budget_map = {
            'UNDER_1K': 500,
            'SMALL_1K_5K': 3000,
            'MID_5K_10K': 7500,
            'MID_10K_25K': 17500,
            'LARGE_25K_50K': 37500,
            'OVER_50K': 75000,
            'DISCUSS': 0
        }
        return budget_map.get(self.budget_range, 0)

    def get_estimated_hours(self):
        """Estimate hours based on service and budget."""
        base_hours = {
            'WEB_DEV': 80,
            'WEB_DESIGN': 40,
            'MOBILE_APP': 120,
            'BRANDING': 30,
            'UI_UX': 50,
            'SEO': 20,
            'CONSULTING': 10,
            'MAINTENANCE': 5,
            'OTHER': 40
        }

        hours = base_hours.get(self.service_requested, 40)

        # Adjust based on budget if available
        if self.budget_range and self.budget_range != 'DISCUSS':
            budget_multiplier = self.get_budget_amount() / 10000  # Normalize to $10k baseline
            hours = int(hours * max(0.5, min(3.0, budget_multiplier)))

        return hours
