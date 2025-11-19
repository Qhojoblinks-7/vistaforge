# admin_dashboard/tasks.py

from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import AdminSettings, SystemLog
from inquiries.models import Inquiry


def send_daily_system_summary():
    """
    Send a daily system summary email to the configured notification email.
    This function should be called every 24 hours via a scheduled task.
    """

    # Get system statistics
    total_inquiries = Inquiry.objects.count()
    new_inquiries_today = Inquiry.objects.filter(
        created_at__date=timezone.now().date()
    ).count()

    new_inquiries = Inquiry.objects.filter(status='NEW').count()
    contacted_inquiries = Inquiry.objects.filter(status='CONTACTED').count()
    won_projects = Inquiry.objects.filter(status='WON').count()
    lost_projects = Inquiry.objects.filter(status='LOST').count()

    # Calculate conversion rate
    conversion_rate = (won_projects / total_inquiries * 100) if total_inquiries > 0 else 0

    # Get recent system logs (last 24 hours)
    recent_logs = list(SystemLog.objects.filter(
        created_at__gte=timezone.now() - timedelta(hours=24)
    ).order_by('-created_at')[:10])

    # Get system health info
    system_health = "Good"
    if any(log.level == 'ERROR' for log in recent_logs):
        system_health = "Warning - Errors detected"
    elif any(log.level == 'CRITICAL' for log in recent_logs):
        system_health = "Critical - System issues detected"

    # Build email content
    subject = f"VistaForge Daily System Summary - {timezone.now().date()}"

    message = f"""
VistaForge System Daily Summary
===============================

Date: {timezone.now().date()}
Time: {timezone.now().strftime('%H:%M:%S UTC')}

📊 SYSTEM STATISTICS
===================
Total Inquiries: {total_inquiries}
New Inquiries Today: {new_inquiries_today}
New Inquiries: {new_inquiries}
Contacted Inquiries: {contacted_inquiries}
Won Projects: {won_projects}
Lost Projects: {lost_projects}
Conversion Rate: {conversion_rate:.1f}%

🏥 SYSTEM HEALTH
================
Status: {system_health}

📋 RECENT ACTIVITY (Last 24 hours)
==================================
"""

    if recent_logs:
        for log in recent_logs:
            message += f"[{log.created_at.strftime('%H:%M')}] {log.level}: {log.message}\n"
    else:
        message += "No recent activity logged.\n"

    message += f"""

🔧 SYSTEM INFORMATION
====================
Django Version: 5.2.7
Database: SQLite3
Server Status: Running
Last Backup: Check backup records for details

---
This is an automated system notification.
VistaForge Admin Dashboard
"""

    try:
        # Send the actual email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SYSTEM_NOTIFICATION_EMAIL],
            fail_silently=False,
        )

        # Update last notification timestamp
        admin_settings = AdminSettings.objects.first()
        if admin_settings:
            admin_settings.last_notification_sent = timezone.now()
            admin_settings.save()

        # Log successful notification
        SystemLog.objects.create(
            level='INFO',
            message=f'Daily system summary email sent to {settings.SYSTEM_NOTIFICATION_EMAIL}',
            category='system'
        )

        return True

    except Exception as e:
        # Log failed notification
        SystemLog.objects.create(
            level='ERROR',
            message=f'Failed to send daily system summary email: {str(e)}',
            category='system'
        )
        return False


def check_and_send_daily_notification():
    """
    Check if 24 hours have passed since last notification and send if needed.
    This function can be called periodically to ensure notifications are sent.
    """
    admin_settings = AdminSettings.objects.first()

    if not admin_settings:
        return False

    # Check if 24 hours have passed
    if admin_settings.last_notification_sent:
        time_since_last = timezone.now() - admin_settings.last_notification_sent
        hours_since_last = time_since_last.total_seconds() / 3600

        if hours_since_last >= settings.SYSTEM_NOTIFICATION_INTERVAL_HOURS:
            return send_daily_system_summary()
    else:
        # First time sending notification
        return send_daily_system_summary()

    return False