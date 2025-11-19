from django.core.management.base import BaseCommand
from django.conf import settings
import json
import os

from projects_app.models import Project


class Command(BaseCommand):
    help = 'Import static projects from backend/data/static_projects.json into the Project model'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to JSON file', default=os.path.join(settings.BASE_DIR, 'backend', 'data', 'static_projects.json'))
        parser.add_argument('--dry-run', action='store_true', help='Show what would be imported without saving')
        parser.add_argument('--user-id', type=int, help='User id to attach as project owner')
        parser.add_argument('--client-id', type=int, help='Client id to associate with projects')

    def handle(self, *args, **options):
        path = options['file']
        dry_run = options['dry_run']

        if not os.path.exists(path):
            self.stdout.write(self.style.ERROR(f'File not found: {path}'))
            return

        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        created = 0
        updated = 0
        for item in data:
            title = item.get('title') or item.get('name')
            if not title:
                self.stdout.write(self.style.WARNING('Skipping item without name/title'))
                continue

            # Resolve user and client: prefer provided IDs, else first available
            User = None
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
            except Exception:
                User = None

            user = None
            client = None

            user_id = options.get('user_id')
            client_id = options.get('client_id')
            if user_id and User:
                try:
                    user = User.objects.get(pk=user_id)
                except User.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'User id {user_id} not found; will try to pick any user'))

            if not user and User:
                user = User.objects.first()

            # Clients model may be under clients_app.Client
            try:
                from clients_app.models import Client as ClientModel
                if client_id:
                    try:
                        client = ClientModel.objects.get(pk=client_id)
                    except ClientModel.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'Client id {client_id} not found; will try to pick any client'))
                if not client:
                    client = ClientModel.objects.first()
            except Exception:
                client = None

            if not user or not client:
                self.stdout.write(self.style.ERROR('No user or client available to associate with projects. Provide --user-id and --client-id or create a user and a client first.'))
                return

            defaults = {
                'title': title,
                'intro': item.get('intro', ''),
                'client_type': item.get('clientType') or item.get('client_type'),
                'industry': item.get('industry', ''),
                'logo': item.get('logo', ''),
                'slug': item.get('slug') or (title.lower().replace(' ', '-')),
                'case_study': item.get('caseStudy') or item.get('case_study') or {},
                'is_active': True,
                'user': user,
                'client': client,
            }

            # Try to find an existing project by slug or title
            slug = defaults.get('slug')
            project_qs = Project.objects.filter(slug=slug)
            if not project_qs.exists():
                project_qs = Project.objects.filter(title=defaults['title'])

            if project_qs.exists():
                project = project_qs.first()
                for k, v in defaults.items():
                    setattr(project, k, v)
                if not dry_run:
                    project.save()
                updated += 1
                self.stdout.write(self.style.SUCCESS(f'Updated: {defaults["title"]}'))
            else:
                if not dry_run:
                    Project.objects.create(**defaults)
                created += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {defaults["title"]}'))

        self.stdout.write(self.style.SUCCESS(f'Done. Created={created} Updated={updated}'))
