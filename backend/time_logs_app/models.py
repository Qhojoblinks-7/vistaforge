from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone


class TimeLog(models.Model):
    """Time log entry for tracking work time on projects."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='time_logs')
    client = models.ForeignKey('clients_app.Client', on_delete=models.CASCADE, related_name='time_logs', null=True, blank=True)
    project = models.ForeignKey('projects_app.Project', on_delete=models.CASCADE, related_name='time_logs', null=True, blank=True)
    task = models.ForeignKey('projects_app.ProjectTask', on_delete=models.SET_NULL, related_name='time_logs', null=True, blank=True)
    milestone = models.ForeignKey('projects_app.ProjectMilestone', on_delete=models.SET_NULL, related_name='time_logs', null=True, blank=True)

    # Time tracking
    start_time = models.DateTimeField(help_text="When the timer started")
    end_time = models.DateTimeField(null=True, blank=True, help_text="When the timer stopped")
    duration_minutes = models.PositiveIntegerField(default=0, help_text="Duration in minutes")

    # Work details
    description = models.TextField(blank=True, null=True, help_text="Description of work done")
    task_name = models.CharField(max_length=200, blank=True, null=True, help_text="Name of the specific task")

    # Status
    STATUS_CHOICES = [
        ('RUNNING', 'Running'),
        ('PAUSED', 'Paused'),
        ('STOPPED', 'Stopped'),
        ('COMPLETED', 'Completed'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='STOPPED',
        help_text="Current status of the time log"
    )

    # Billing
    is_billable = models.BooleanField(default=True, help_text="Whether this time is billable")
    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Hourly rate for billing"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Time Log"
        verbose_name_plural = "Time Logs"
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['user', '-start_time']),
            models.Index(fields=['client', '-start_time']),
            models.Index(fields=['project', '-start_time']),
            models.Index(fields=['task', '-start_time']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        project_info = f" - {self.project.title}" if self.project else ""
        task_info = f" - {self.task.name}" if self.task else f" - {self.task_name or 'Task'}"
        return f"{self.user.username}{project_info}{task_info} ({self.duration_minutes} min)"

    @property
    def duration_hours(self):
        """Get duration in hours (decimal)."""
        return round(self.duration_minutes / 60, 2)

    @property
    def total_cost(self):
        """Calculate total cost if billable and hourly rate is set."""
        if self.is_billable and self.hourly_rate:
            return round(float(self.hourly_rate) * self.duration_hours, 2)
        return 0.0

    def save(self, *args, **kwargs):
        # Auto-calculate duration if end_time is set
        if self.end_time and self.start_time:
            duration = self.end_time - self.start_time
            self.duration_minutes = int(duration.total_seconds() / 60)

        # Auto-stop if duration reaches a reasonable limit (24 hours)
        if self.duration_minutes > 1440:  # 24 hours in minutes
            self.status = 'STOPPED'
            self.end_time = self.start_time + timezone.timedelta(minutes=1440)

        super().save(*args, **kwargs)

        # Update client's outstanding balance if billable
        if self.is_billable and self.hourly_rate and self.status == 'COMPLETED':
            self.update_client_balance()

    def update_client_balance(self):
        """Update client's outstanding balance when billable time is logged."""
        if self.client and self.is_billable and self.hourly_rate:
            cost = self.total_cost
            self.client.outstanding_balance += cost
            self.client.save()


class TimeLogEntry(models.Model):
    """Individual time entries within a time log (for detailed tracking)."""

    time_log = models.ForeignKey(TimeLog, on_delete=models.CASCADE, related_name='entries')
    start_time = models.DateTimeField(help_text="Start time of this entry")
    end_time = models.DateTimeField(null=True, blank=True, help_text="End time of this entry")
    duration_minutes = models.PositiveIntegerField(default=0, help_text="Duration in minutes")
    notes = models.TextField(blank=True, null=True, help_text="Notes for this entry")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Time Log Entry"
        verbose_name_plural = "Time Log Entries"
        ordering = ['start_time']

    def __str__(self):
        return f"Entry for {self.time_log} ({self.duration_minutes} min)"

    def save(self, *args, **kwargs):
        # Auto-calculate duration
        if self.end_time and self.start_time:
            duration = self.end_time - self.start_time
            self.duration_minutes = int(duration.total_seconds() / 60)
        super().save(*args, **kwargs)
