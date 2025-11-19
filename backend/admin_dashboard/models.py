from django.db import models
from django.contrib.auth.models import User
import json


class AdminSettings(models.Model):
    """Model to store admin dashboard settings and preferences."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_settings')

    # Profile Information
    full_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Preferences
    default_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)
    currency = models.CharField(max_length=3, default='USD', choices=[
        ('USD', 'US Dollar ($)'),
        ('EUR', 'Euro (€)'),
        ('GBP', 'British Pound (£)'),
        ('GHS', 'Ghanaian Cedi (₵)'),
    ])
    timezone = models.CharField(max_length=50, default='Africa/Accra', choices=[
        ('Africa/Accra', 'Africa/Accra (GMT+0)'),
        ('America/New_York', 'America/New_York (EST)'),
        ('Europe/London', 'Europe/London (GMT)'),
    ])
    language = models.CharField(max_length=5, default='en', choices=[
        ('en', 'English'),
        ('es', 'Español - Spanish'),
        ('fr', 'Français - French'),
    ])

    # Notifications
    email_reminders = models.BooleanField(default=True)
    project_updates = models.BooleanField(default=True)
    invoice_due_reminders = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)

    # System Settings
    maintenance_mode = models.BooleanField(default=False)
    debug_mode = models.BooleanField(default=False)
    backup_frequency = models.CharField(max_length=20, default='daily', choices=[
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ])

    # Dashboard Preferences
    dashboard_layout = models.JSONField(default=dict, blank=True)
    theme = models.CharField(max_length=20, default='light', choices=[
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('auto', 'Auto'),
    ])

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Track last notification sent
    last_notification_sent = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Admin Settings"
        verbose_name_plural = "Admin Settings"

    def __str__(self):
        return f"Settings for {self.user.username}"

    def get_dashboard_layout(self):
        """Get dashboard layout with defaults."""
        default_layout = {
            'widgets': ['stats', 'recent_activity', 'upcoming_deadlines'],
            'columns': 3,
            'compact_mode': False
        }
        return {**default_layout, **self.dashboard_layout}

    def set_dashboard_layout(self, layout):
        """Set dashboard layout."""
        self.dashboard_layout = layout
        self.save()


class SystemLog(models.Model):
    """Model to store system logs and activities."""

    LOG_LEVELS = [
        ('DEBUG', 'Debug'),
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.CharField(max_length=10, choices=LOG_LEVELS, default='INFO')
    message = models.TextField()
    category = models.CharField(max_length=50, default='general', choices=[
        ('general', 'General'),
        ('security', 'Security'),
        ('database', 'Database'),
        ('api', 'API'),
        ('user', 'User Activity'),
        ('system', 'System'),
    ])
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "System Log"
        verbose_name_plural = "System Logs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['level', 'category']),
            models.Index(fields=['created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"[{self.level}] {self.category}: {self.message[:50]}"


class BackupRecord(models.Model):
    """Model to track backup operations."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    backup_type = models.CharField(max_length=20, choices=[
        ('manual', 'Manual'),
        ('scheduled', 'Scheduled'),
        ('auto', 'Automatic'),
    ])
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_size = models.BigIntegerField(null=True, blank=True)  # Size in bytes
    duration = models.DurationField(null=True, blank=True)
    error_message = models.TextField(blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Backup Record"
        verbose_name_plural = "Backup Records"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.backup_type} backup - {self.status} ({self.created_at.date()})"
