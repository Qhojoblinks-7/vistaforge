from django.db import models
import json


class Project(models.Model):
    """Model for portfolio projects"""

    # Basic project information
    name = models.CharField(max_length=200, help_text="Project name")
    slug = models.SlugField(unique=True, help_text="URL-friendly identifier")
    client_type = models.CharField(max_length=100, help_text="Type of client (SME, Startup, etc.)")
    industry = models.CharField(max_length=100, help_text="Industry sector")
    intro = models.TextField(help_text="Brief project introduction")
    logo = models.URLField(help_text="Logo image URL")

    # Project type classification
    PROJECT_TYPES = [
        ('design', 'Design Project'),
        ('development', 'Development Project'),
        ('fullstack', 'Full-Stack Project'),
    ]
    project_type = models.CharField(
        max_length=20,
        choices=PROJECT_TYPES,
        default='development',
        help_text="Type of project"
    )

    # Design tools (for design projects)
    design_tools = models.JSONField(
        default=list,
        blank=True,
        help_text="List of design tools used (e.g., ['figma', 'photoshop'])"
    )

    # Case study content
    starting_point = models.TextField(help_text="Problem/challenge description")
    the_transformation = models.TextField(help_text="Solution/approach description")
    journey_end = models.TextField(help_text="Results/outcomes description")

    # Visual assets
    visuals = models.JSONField(
        default=dict,
        blank=True,
        help_text="Dictionary of visual assets with URLs"
    )

    # Design-specific fields
    deliverables = models.JSONField(
        default=list,
        blank=True,
        help_text="List of deliverables for design projects"
    )

    design_system = models.JSONField(
        default=dict,
        blank=True,
        help_text="Design system information (colors, typography, etc.)"
    )

    # Metadata
    is_active = models.BooleanField(default=True, help_text="Whether project is publicly visible")
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name

    def get_design_tools_display(self):
        """Return formatted design tools for display"""
        tool_names = {
            'figma': 'Figma',
            'photoshop': 'Adobe Photoshop',
            'illustrator': 'Adobe Illustrator',
            'xd': 'Adobe XD',
            'sketch': 'Sketch',
            'invision': 'InVision',
        }
        return [tool_names.get(tool, tool.title()) for tool in self.design_tools]

    @property
    def is_design_project(self):
        """Check if this is a design-focused project"""
        return self.project_type == 'design' or bool(self.design_tools)


class ProjectImage(models.Model):
    """Model for additional project images"""
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, help_text="Image title/description")
    image_url = models.URLField(help_text="Image URL")
    alt_text = models.CharField(max_length=200, help_text="Alt text for accessibility")
    order = models.PositiveIntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.name} - {self.title}"


class ContactSubmission(models.Model):
    """Model for contact form submissions"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    project_type = models.CharField(max_length=100, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)

    # Location data for map
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    location_name = models.CharField(max_length=200, blank=True, help_text="City, Country or location description")
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # Metadata
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Contact from {self.name} - {self.email}"

    class Meta:
        ordering = ['-submitted_at']


class MapMarker(models.Model):
    """Model for storing map markers/locations"""
    title = models.CharField(max_length=200, help_text="Marker title")
    description = models.TextField(blank=True, help_text="Optional description")
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    location_name = models.CharField(max_length=200, help_text="City, Country")
    marker_type = models.CharField(
        max_length=50,
        choices=[
            ('client', 'Client Location'),
            ('office', 'Office Location'),
            ('project', 'Project Location'),
            ('event', 'Event Location'),
        ],
        default='client'
    )

    # Optional associations
    related_project = models.ForeignKey(
        Project,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='map_markers'
    )
    related_contact = models.ForeignKey(
        ContactSubmission,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='map_markers'
    )

    # Display settings
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.location_name}"

    class Meta:
        ordering = ['display_order', '-created_at']


class Task(models.Model):
    """Model for project tasks"""
    STATUS_CHOICES = [
        ('to_do', 'To Do'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
        ('blocked', 'Blocked'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='to_do')
    assigned_to = models.CharField(max_length=100, blank=True)
    due_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'due_date', 'created_at']

    def __str__(self):
        return f"{self.project.name} - {self.name}"


class Milestone(models.Model):
    """Model for project milestones"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=200)
    target_date = models.DateField()
    is_reached = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'target_date']

    def __str__(self):
        return f"{self.project.name} - {self.name}"
