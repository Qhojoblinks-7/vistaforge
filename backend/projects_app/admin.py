from django.contrib import admin
from .models import Project, ProjectMilestone, ProjectTask, ProjectNote, ProjectFile


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'status', 'project_phase', 'priority', 'progress_percentage', 'is_active', 'created_at']
    list_filter = ['status', 'project_phase', 'priority', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'client__name', 'client__company']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'client', 'intro', 'slug', 'logo')
        }),
        ('Status & Phase', {
            'fields': ('status', 'project_phase', 'priority', 'progress_percentage', 'is_active')
        }),
        ('Financial', {
            'fields': ('budget', 'hourly_rate')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'estimated_hours')
        }),
        ('Technical', {
            'fields': ('design_tools', 'technologies')
        }),
        ('Case Study', {
            'fields': ('case_study', 'client_type', 'industry')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'due_date', 'status', 'is_completed', 'order']
    list_filter = ['status', 'is_completed', 'due_date']
    search_fields = ['title', 'description', 'project__title']
    ordering = ['due_date']


@admin.register(ProjectTask)
class ProjectTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'priority', 'assigned_to', 'estimated_hours', 'order']
    list_filter = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'description', 'project__title']
    ordering = ['order', 'created_at']


@admin.register(ProjectNote)
class ProjectNoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'user', 'note_type', 'is_internal', 'created_at']
    list_filter = ['note_type', 'is_internal', 'created_at']
    search_fields = ['title', 'content', 'project__title']
    ordering = ['-created_at']


@admin.register(ProjectFile)
class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'user', 'file_type', 'file_name', 'file_size', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['title', 'file_name', 'project__title']
    ordering = ['-created_at']