#!/usr/bin/env python
"""
Sample data creation script for VistaForge
Run with: python manage.py shell < create_sample_data.py
"""

import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from datetime import date, timedelta, datetime
import random

# Import models
from clients_app.models import Client
from projects_app.models import Project, ProjectTask
from invoices_app.models import Invoice, InvoiceItem
from time_logs_app.models import TimeLog

def create_sample_clients():
    """Create sample clients"""
    clients_data = [
        {
            'name': 'TechCorp Ghana',
            'company': 'TechCorp Ltd',
            'contact_email': 'contact@techcorpgh.com',
            'phone': '+233 24 123 4567',
            'address': 'Accra, Ghana',
            'notes': 'Leading tech company in Ghana'
        },
        {
            'name': 'Green Solutions',
            'company': 'Green Solutions Ltd',
            'contact_email': 'info@greensolutions.com',
            'phone': '+233 20 987 6543',
            'address': 'Tema, Ghana',
            'notes': 'Environmental consulting firm'
        },
        {
            'name': 'EduLearn',
            'company': 'EduLearn Institute',
            'contact_email': 'admin@edulearn.edu.gh',
            'phone': '+233 30 555 1234',
            'address': 'Cape Coast, Ghana',
            'notes': 'Educational technology provider'
        },
        {
            'name': 'HealthFirst Clinic',
            'company': 'HealthFirst Medical',
            'contact_email': 'appointments@healthfirstclinic.com',
            'phone': '+233 50 777 8888',
            'address': 'Takoradi, Ghana',
            'notes': 'Modern healthcare facility'
        },
        {
            'name': 'AgriTech Solutions',
            'company': 'AgriTech Ltd',
            'contact_email': 'support@agritechgh.com',
            'phone': '+233 27 444 5555',
            'address': 'Kumasi, Ghana',
            'notes': 'Agricultural technology company'
        }
    ]

    user = User.objects.filter(username='dev_admin').first()
    if not user:
        print("No dev_admin user found!")
        return

    clients = []
    for client_data in clients_data:
        client, created = Client.objects.get_or_create(
            user=user,
            contact_email=client_data['contact_email'],
            defaults=client_data
        )
        clients.append(client)
        if created:
            print(f"Created client: {client.name}")
        else:
            print(f"Client already exists: {client.name}")

    return clients

def create_sample_invoices(clients, projects):
    """Create sample invoices"""
    user = User.objects.filter(username='dev_admin').first()
    if not user:
        return

    # Create some invoices
    invoices_data = [
        {
            'client': clients[0],  # TechCorp
            'project': None,  # No project for simplicity
            'issue_date': date.today() - timedelta(days=30),
            'due_date': date.today() + timedelta(days=30),
            'status': 'PAID',
            'notes': 'Website development and branding',
            'items': [
                {'description': 'Website Design', 'quantity': 1, 'rate': Decimal('2500.00')},
                {'description': 'Development', 'quantity': 40, 'rate': Decimal('75.00')},
                {'description': 'SEO Setup', 'quantity': 1, 'rate': Decimal('500.00')}
            ]
        },
        {
            'client': clients[1],  # Green Solutions
            'project': None,
            'issue_date': date.today() - timedelta(days=15),
            'due_date': date.today() + timedelta(days=15),
            'status': 'SENT',
            'notes': 'Mobile app development',
            'items': [
                {'description': 'UI/UX Design', 'quantity': 1, 'rate': Decimal('1800.00')},
                {'description': 'iOS Development', 'quantity': 30, 'rate': Decimal('80.00')},
                {'description': 'Android Development', 'quantity': 30, 'rate': Decimal('75.00')}
            ]
        },
        {
            'client': clients[2],  # EduLearn
            'project': None,
            'issue_date': date.today() - timedelta(days=7),
            'due_date': date.today() + timedelta(days=23),
            'status': 'DRAFT',
            'notes': 'E-learning platform development',
            'items': [
                {'description': 'Platform Architecture', 'quantity': 1, 'rate': Decimal('3500.00')},
                {'description': 'Frontend Development', 'quantity': 50, 'rate': Decimal('70.00')},
                {'description': 'Backend Development', 'quantity': 40, 'rate': Decimal('85.00')}
            ]
        },
        {
            'client': clients[3],  # HealthFirst
            'project': None,
            'issue_date': date.today() - timedelta(days=45),
            'due_date': date.today() - timedelta(days=15),
            'status': 'OVERDUE',
            'notes': 'Healthcare management system',
            'items': [
                {'description': 'System Design', 'quantity': 1, 'rate': Decimal('4200.00')},
                {'description': 'Database Development', 'quantity': 25, 'rate': Decimal('90.00')},
                {'description': 'Integration', 'quantity': 15, 'rate': Decimal('100.00')}
            ]
        }
    ]

    for invoice_data in invoices_data:
        items_data = invoice_data.pop('items')
        client = invoice_data.pop('client')  # Remove from dict
        project = invoice_data.pop('project', None)  # Remove from dict

        # Generate invoice number
        invoice_number = f"INV{timezone.now().strftime('%Y%m%d%H%M%S')}"

        invoice = Invoice.objects.create(
            user=user,
            client=client,
            project=project,
            invoice_number=invoice_number,
            **invoice_data
        )

        # Create invoice items
        subtotal = Decimal('0')
        for item_data in items_data:
            item = InvoiceItem.objects.create(
                invoice=invoice,
                description=item_data['description'],
                quantity=item_data['quantity'],
                rate=item_data['rate']
            )
            subtotal += item.amount

        # Update totals
        invoice.subtotal = subtotal
        invoice.tax = subtotal * Decimal('0.125')  # 12.5% tax
        invoice.discount = Decimal('0')
        invoice.total = invoice.subtotal + invoice.tax - invoice.discount
        invoice.save()

        print(f"Created invoice: {invoice.invoice_number} for {client.name} - Total: ${invoice.total}")

def create_sample_time_logs(clients, projects):
    """Create sample time logs"""
    user = User.objects.filter(username='dev_admin').first()
    if not user:
        return

    tasks = [
        'Website Design', 'Frontend Development', 'Backend Development',
        'Database Setup', 'API Integration', 'Testing', 'Deployment',
        'Client Meeting', 'Code Review', 'Bug Fixing'
    ]

    time_logs = []
    for i in range(20):
        # Random date within last 30 days
        days_ago = random.randint(0, 30)
        log_date = date.today() - timedelta(days=days_ago)

        # Random start time
        start_hour = random.randint(8, 17)
        start_minute = random.choice([0, 15, 30, 45])
        start_time = datetime.combine(log_date, datetime.min.time().replace(hour=start_hour, minute=start_minute))

        # Random duration (30 min to 8 hours)
        duration_minutes = random.randint(30, 480)

        end_time = start_time + timedelta(minutes=duration_minutes)

        # Random client and project
        client = random.choice(clients) if clients else None
        project = random.choice(projects) if projects else None

        time_log = TimeLog.objects.create(
            user=user,
            client=client,
            start_time=start_time,
            end_time=end_time,
            duration_minutes=duration_minutes,
            description=f"Working on {random.choice(tasks)}",
            task_name=random.choice(tasks),
            status='STOPPED',
            is_billable=random.choice([True, True, False]),  # 2/3 billable
            hourly_rate=Decimal('75.00') if random.choice([True, False]) else Decimal('0')
        )

        time_logs.append(time_log)
        print(f"Created time log: {time_log.task_name} - {duration_minutes}min")

    return time_logs

def create_sample_tasks(projects):
    """Add sample tasks to projects"""
    task_templates = [
        {'title': 'Initial Research & Planning', 'status': 'COMPLETED', 'estimated_hours': 8},
        {'title': 'Design Mockups', 'status': 'COMPLETED', 'estimated_hours': 16},
        {'title': 'Client Review & Feedback', 'status': 'COMPLETED', 'estimated_hours': 4},
        {'title': 'Frontend Development', 'status': 'IN_PROGRESS', 'estimated_hours': 40},
        {'title': 'Backend Development', 'status': 'TODO', 'estimated_hours': 35},
        {'title': 'Database Setup', 'status': 'TODO', 'estimated_hours': 12},
        {'title': 'API Integration', 'status': 'TODO', 'estimated_hours': 20},
        {'title': 'Testing & QA', 'status': 'TODO', 'estimated_hours': 16},
        {'title': 'Deployment', 'status': 'TODO', 'estimated_hours': 8},
        {'title': 'Documentation', 'status': 'TODO', 'estimated_hours': 6}
    ]

    for project in projects:
        # Skip if project already has tasks
        if project.tasks.exists():
            continue

        for i, task_data in enumerate(task_templates):
            ProjectTask.objects.create(
                project=project,
                title=task_data['title'],
                status=task_data['status'],
                estimated_hours=task_data['estimated_hours'],
                order=i
            )

        print(f"Added {len(task_templates)} tasks to project: {project.title}")

def main():
    print("Creating sample data...")

    # Create clients
    clients = create_sample_clients()

    # Get existing projects
    user = User.objects.filter(username='dev_admin').first()
    projects = list(Project.objects.filter(user=user))

    # Create invoices
    # create_sample_invoices(clients, projects)  # Skip for now due to FK issue

    # Create time logs
    create_sample_time_logs(clients, projects)

    # Create tasks for projects
    create_sample_tasks(projects)

    print("\nSample data creation completed!")
    print(f"Clients: {Client.objects.filter(user=user).count()}")
    print(f"Projects: {Project.objects.filter(user=user).count()}")
    print(f"Invoices: {Invoice.objects.filter(user=user).count()}")
    print(f"Time Logs: {TimeLog.objects.filter(user=user).count()}")
    print(f"Tasks: {ProjectTask.objects.filter(project__user=user).count()}")

if __name__ == '__main__':
    main()
else:
    # When run via shell < script.py, execute main
    main()