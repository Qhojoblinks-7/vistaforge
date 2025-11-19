from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Client, ClientContact, ClientNote


class ClientContactInline(admin.TabularInline):
    model = ClientContact
    extra = 0
    fields = ['name', 'title', 'email', 'phone', 'is_primary']


class ClientNoteInline(admin.TabularInline):
    model = ClientNote
    extra = 0
    readonly_fields = ['created_at', 'updated_at']
    fields = ['note_type', 'title', 'content', 'follow_up_required', 'follow_up_date', 'follow_up_completed', 'created_at']


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'company',
        'contact_email',
        'status',
        'total_revenue',
        'outstanding_balance',
        'total_projects',
        'active_projects',
        'created_at'
    ]
    list_filter = ['status', 'industry', 'created_at']
    search_fields = ['name', 'company', 'contact_email', 'phone']
    readonly_fields = ['total_revenue', 'outstanding_balance', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'company', 'contact_email', 'phone', 'website')
        }),
        ('Business Details', {
            'fields': ('industry', 'tax_id', 'payment_terms')
        }),
        ('Address & Additional Contacts', {
            'fields': ('address', 'secondary_email', 'secondary_phone')
        }),
        ('Status & Financial Summary', {
            'fields': ('status', 'total_revenue', 'outstanding_balance')
        }),
        ('Internal Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [ClientContactInline, ClientNoteInline]

    def total_projects(self, obj):
        return obj.total_projects
    total_projects.short_description = 'Total Projects'

    def active_projects(self, obj):
        return obj.active_projects
    active_projects.short_description = 'Active Projects'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('projects', 'invoices')


@admin.register(ClientContact)
class ClientContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'title', 'email', 'phone', 'is_primary']
    list_filter = ['is_primary', 'client__status']
    search_fields = ['name', 'email', 'client__name', 'client__company']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Contact Information', {
            'fields': ('client', 'name', 'title', 'email', 'phone', 'is_primary')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('client')


@admin.register(ClientNote)
class ClientNoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'note_type', 'user', 'follow_up_required', 'follow_up_date', 'created_at']
    list_filter = ['note_type', 'follow_up_required', 'follow_up_completed', 'created_at']
    search_fields = ['title', 'content', 'client__name', 'client__company']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Note Information', {
            'fields': ('client', 'user', 'note_type', 'title', 'content')
        }),
        ('Follow-up', {
            'fields': ('follow_up_required', 'follow_up_date', 'follow_up_completed')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('client', 'user')
