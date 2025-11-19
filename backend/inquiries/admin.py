from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'client_email', 'service_requested', 'status', 'created_at')
    list_filter = ('status', 'service_requested', 'created_at')
    search_fields = ('client_name', 'client_email', 'message')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    fieldsets = (
        ('Client Information', {
            'fields': ('client_name', 'client_email')
        }),
        ('Inquiry Details', {
            'fields': ('message', 'service_requested')
        }),
        ('Status & Management', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
