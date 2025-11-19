from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import InvoiceProject, Invoice, InvoiceItem


@admin.register(InvoiceProject)
class InvoiceProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'status', 'budget', 'start_date', 'end_date', 'is_active']
    list_filter = ['status', 'is_active', 'created_at']
    search_fields = ['title', 'client__name', 'client__company']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('client', 'title', 'description')
        }),
        ('Project Details', {
            'fields': ('status', 'budget', 'start_date', 'end_date', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0
    readonly_fields = ['amount']
    fields = ['description', 'quantity', 'rate', 'amount']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = [
        'invoice_number',
        'client',
        'project',
        'total',
        'status',
        'issue_date',
        'due_date',
        'is_overdue_display'
    ]
    list_filter = ['status', 'issue_date', 'due_date']
    search_fields = ['invoice_number', 'client__name', 'client__company']
    readonly_fields = ['uuid', 'created_at', 'updated_at']
    inlines = [InvoiceItemInline]

    fieldsets = (
        ('Invoice Information', {
            'fields': ('invoice_number', 'uuid', 'client', 'project')
        }),
        ('Dates & Status', {
            'fields': ('issue_date', 'due_date', 'paid_date', 'status')
        }),
        ('Financial Details', {
            'fields': ('subtotal', 'tax', 'discount', 'total')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def is_overdue_display(self, obj):
        if obj.is_overdue:
            return format_html(
                '<span style="color: red; font-weight: bold;">Overdue ({} days)</span>',
                obj.days_overdue
            )
        return format_html('<span style="color: green;">On Time</span>')
    is_overdue_display.short_description = 'Payment Status'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('client', 'project')


@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ['description', 'invoice', 'quantity', 'rate', 'amount']
    list_filter = ['invoice__status', 'created_at']
    search_fields = ['description', 'invoice__invoice_number']
    readonly_fields = ['amount', 'created_at', 'updated_at']

    fieldsets = (
        ('Item Details', {
            'fields': ('invoice', 'description', 'quantity', 'rate', 'amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('invoice')
