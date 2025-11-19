# admin_dashboard/management/commands/send_daily_notifications.py

from django.core.management.base import BaseCommand
from admin_dashboard.tasks import send_daily_system_summary


class Command(BaseCommand):
    help = 'Send daily system summary notification email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force send notification regardless of timing',
        )

    def handle(self, *args, **options):
        self.stdout.write('Sending daily system summary notification...')

        try:
            success = send_daily_system_summary()

            if success:
                self.stdout.write(
                    self.style.SUCCESS('Successfully sent daily system summary notification')
                )
            else:
                self.stdout.write(
                    self.style.ERROR('Failed to send daily system summary notification')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error sending notification: {str(e)}')
            )