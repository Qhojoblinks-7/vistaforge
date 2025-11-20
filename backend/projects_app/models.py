from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Project(models.Model):
    """Project model for managing client projects."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects_app_projects')

    # Relationship to inquiry if project was created from an inquiry
    inquiry = models.ForeignKey('inquiries.Inquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_projects')

    # Basic Information
    title = models.CharField(max_length=200, help_text="Project title")
    description = models.TextField(blank=True, null=True, help_text="Project description")
    # Public-facing metadata used by the Portfolio / Case Studies
    slug = models.SlugField(max_length=200, blank=True, null=True, help_text="URL-friendly slug")
    intro = models.TextField(blank=True, null=True, help_text="Short intro used on portfolio listings")
    client_type = models.CharField(max_length=120, blank=True, null=True, help_text="Client type shown in portfolio (e.g. SME, Startup)")
    industry = models.CharField(max_length=120, blank=True, null=True, help_text="Industry label for the project")
    logo = models.CharField(max_length=500, blank=True, null=True, help_text="URL to project logo or avatar")

    # Case study JSON blob: {
    #   startingPoint, theTransformation, journeyEnd, visuals: { ... },
    #   process: { researchMethods, technicalImplementation, testingValidation, lessonsLearned }
    # }
    case_study = models.JSONField(default=dict, blank=True, null=True, help_text="Structured case study content")
    client = models.ForeignKey('clients_app.Client', on_delete=models.CASCADE, related_name='projects', help_text="Associated client")

    # Status and Phase
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('IN_PROGRESS', 'In Progress'),
        ('ON_HOLD', 'On Hold'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PLANNING',
        help_text="Project status"
    )

    PROJECT_PHASE_CHOICES = [
        ('DISCOVERY', 'Discovery'),
        ('DESIGN', 'Design'),
        ('DEVELOPMENT', 'Development'),
        ('TESTING', 'Testing'),
        ('DEPLOYMENT', 'Deployment'),
        ('MAINTENANCE', 'Maintenance'),
    ]
    project_phase = models.CharField(
        max_length=20,
        choices=PROJECT_PHASE_CHOICES,
        default='DISCOVERY',
        help_text="Current project phase"
    )

    # Financial Information
    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Project budget"
    )
    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Hourly billing rate"
    )

    # Timeline
    start_date = models.DateField(blank=True, null=True, help_text="Project start date")
    end_date = models.DateField(blank=True, null=True, help_text="Project end date")
    estimated_hours = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Estimated total hours"
    )

    # Technical Information
    design_tools = models.JSONField(default=list, blank=True, help_text="Design tools used")
    technologies = models.JSONField(default=list, blank=True, help_text="Technologies used")

    # Project Management
    priority = models.CharField(
        max_length=20,
        choices=[
            ('LOW', 'Low'),
            ('MEDIUM', 'Medium'),
            ('HIGH', 'High'),
            ('URGENT', 'Urgent'),
        ],
        default='MEDIUM',
        help_text="Project priority"
    )

    progress_percentage = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Project completion percentage (0-100)"
    )

    # Metadata
    is_active = models.BooleanField(default=True, help_text="Is project currently active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # class Meta:
    #     verbose_name = "Project"
    #     verbose_name_plural = "Projects"
    #     ordering = ['-created_at']

    # def __str__(self):
    #     return f"{self.title} - {self.client.name}"

    # @property
    # def total_logged_hours(self):
    #     """Get total hours logged for this project."""
    #     from time_logs_app.models import TimeLog
    #     return TimeLog.objects.filter(client=self.client).aggregate(
    #         total=models.Sum('duration_minutes')
    #     )['total'] or 0

    # @property
    # def total_cost(self):
    #     """Calculate total cost based on logged hours and hourly rate."""
    #     return (self.total_logged_hours / 60) * float(self.hourly_rate)

    # @property
    # def remaining_hours(self):
    #     """Calculate remaining hours based on estimate and logged time."""
    #     return max(0, float(self.estimated_hours) - (self.total_logged_hours / 60))

    # @property
    # def is_over_budget(self):
    #     """Check if project is over budget."""
    #     return self.total_cost > float(self.budget) if self.budget > 0 else False

    # @property
    # def days_until_deadline(self):
    #     """Calculate days until project deadline."""
    #     if not self.end_date:
    #         return None
    #     today = timezone.now().date()
    #     if self.end_date < today:
    #         return -(self.end_date - today).days  # Negative for overdue
    #     return (self.end_date - today).days

    def update_progress_from_tasks(self):
        """Update project progress based on completed tasks."""
        total_tasks = self.tasks.count()
        if total_tasks > 0:
            completed_tasks = self.tasks.filter(status='COMPLETED').count()
            self.progress_percentage = int((completed_tasks / total_tasks) * 100)
            self.save()

    def update_client_revenue(self):
        """Update client's total revenue when project is completed."""
        from invoices_app.models import Invoice
        if self.status == 'COMPLETED':
            # Calculate revenue from all paid invoices for this project
            paid_invoices = Invoice.objects.filter(
                project=self,
                status='PAID'
            )
            project_revenue = sum(invoice.total for invoice in paid_invoices)

            # Update client's total revenue
            self.client.total_revenue += project_revenue
            self.client.save()

    # def save(self, *args, **kwargs):
    #     # Store old status for comparison
    #     old_status = None
    #     if self.pk:
    #         old_status = Project.objects.get(pk=self.pk).status

    #     super().save(*args, **kwargs)

    #     # Update client revenue if project was just completed
    #     if old_status != 'COMPLETED' and self.status == 'COMPLETED':
    #         self.update_client_revenue()

    #     # Update progress from tasks
    #     self.update_progress_from_tasks()


class ProjectMilestone(models.Model):
    """Milestones within a project."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')

    title = models.CharField(max_length=200, help_text="Milestone title")
    description = models.TextField(blank=True, null=True, help_text="Milestone description")
    due_date = models.DateField(help_text="Milestone due date")

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('OVERDUE', 'Overdue'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text="Milestone status"
    )

    order = models.IntegerField(default=0, help_text="Display order")
    is_completed = models.BooleanField(default=False, help_text="Is milestone completed")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project Milestone"
        verbose_name_plural = "Project Milestones"
        ordering = ['order', 'due_date']

    def __str__(self):
        return f"{self.title} - {self.project.title}"

    @property
    def is_overdue(self):
        """Check if milestone is overdue."""
        return not self.is_completed and self.due_date < timezone.now().date()


class ProjectTask(models.Model):
    """Tasks within a project."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    milestone = models.ForeignKey(ProjectMilestone, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')

    title = models.CharField(max_length=200, help_text="Task title")
    description = models.TextField(blank=True, null=True, help_text="Task description")

    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('BLOCKED', 'Blocked'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TODO',
        help_text="Task status"
    )

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='MEDIUM',
        help_text="Task priority"
    )

    assigned_to = models.CharField(max_length=100, blank=True, null=True, help_text="Person assigned to task")
    estimated_hours = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Estimated hours for task"
    )

    order = models.IntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project Task"
        verbose_name_plural = "Project Tasks"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.title} - {self.project.title}"


class ProjectNote(models.Model):
    """Notes and comments for projects."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='notes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who created the note")

    NOTE_TYPE_CHOICES = [
        ('GENERAL', 'General Note'),
        ('MEETING', 'Meeting Notes'),
        ('CLIENT_FEEDBACK', 'Client Feedback'),
        ('TECHNICAL', 'Technical Note'),
        ('ISSUE', 'Issue/Problem'),
        ('SOLUTION', 'Solution/Update'),
    ]
    note_type = models.CharField(
        max_length=20,
        choices=NOTE_TYPE_CHOICES,
        default='GENERAL',
        help_text="Type of note"
    )

    title = models.CharField(max_length=200, help_text="Note title")
    content = models.TextField(help_text="Note content")

    # Visibility
    is_internal = models.BooleanField(default=True, help_text="Is this internal note (not visible to client)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project Note"
        verbose_name_plural = "Project Notes"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.project.title}"


class ProjectFile(models.Model):
    """Files attached to projects."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who uploaded the file")

    FILE_TYPE_CHOICES = [
        ('DESIGN', 'Design File'),
        ('DOCUMENT', 'Document'),
        ('CODE', 'Code/Script'),
        ('IMAGE', 'Image'),
        ('VIDEO', 'Video'),
        ('OTHER', 'Other'),
    ]
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        default='OTHER',
        help_text="Type of file"
    )

    title = models.CharField(max_length=200, help_text="File title/description")
    file_name = models.CharField(max_length=255, help_text="Original file name")
    file_path = models.CharField(max_length=500, help_text="File path/URL")
    file_size = models.IntegerField(help_text="File size in bytes")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project File"
        verbose_name_plural = "Project Files"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.project.title}"


class UserGoals(models.Model):
    """User-defined goals and targets for analytics tracking."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='goals')

    # Revenue goals
    monthly_revenue_target = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Monthly revenue target in dollars"
    )

    # Client satisfaction goal (1-5 scale)
    client_satisfaction_target = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Target client satisfaction rating (1-5)"
    )

    # Current client satisfaction (calculated from feedback/surveys)
    current_client_satisfaction = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Current average client satisfaction rating"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Goals"
        verbose_name_plural = "User Goals"

    def __str__(self):
        return f"Goals for {self.user.username}"