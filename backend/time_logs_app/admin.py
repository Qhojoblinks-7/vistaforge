from django.contrib import admin
from .models import TimeLog, TimeLogEntry


@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'client', 'task_name', 'start_time', 'end_time', 'duration_minutes', 'status', 'is_billable')
    list_filter = ('status', 'is_billable', 'user', 'client', 'start_time')
    search_fields = ('task_name', 'description', 'user__username', 'client__name')
    readonly_fields = ('duration_minutes', 'created_at', 'updated_at')
    ordering = ('-start_time',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'client')
        }),
        ('Time Tracking', {
            'fields': ('start_time', 'end_time', 'duration_minutes', 'status')
        }),
        ('Work Details', {
            'fields': ('task_name', 'description')
        }),
        ('Billing', {
            'fields': ('is_billable', 'hourly_rate')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TimeLogEntry)
class TimeLogEntryAdmin(admin.ModelAdmin):
    list_display = ('time_log', 'start_time', 'end_time', 'duration_minutes')
    list_filter = ('start_time', 'time_log__user')
    search_fields = ('time_log__task_name', 'notes')
    readonly_fields = ('duration_minutes', 'created_at')
    ordering = ('-start_time',)

    fieldsets = (
        ('Time Log Reference', {
            'fields': ('time_log',)
        }),
        ('Time Entry', {
            'fields': ('start_time', 'end_time', 'duration_minutes')
        }),
        ('Details', {
            'fields': ('notes', 'created_at')
        }),
    )
