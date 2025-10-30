from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


def send_contact_notification(contact_submission):
    """
    Send email notification when a new contact form is submitted
    """
    subject = f"New Contact Form Submission from {contact_submission.name}"

    # Email content for admin
    admin_context = {
        'contact': contact_submission,
        'admin_url': f"{settings.SITE_URL}/admin/projects/contactsubmission/{contact_submission.id}/change/"
    }

    admin_message = render_to_string('emails/contact_notification.html', admin_context)

    # Send to admin
    send_mail(
        subject=subject,
        message=admin_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=admin_message,
        fail_silently=False,
    )

    # Auto-reply to user
    user_subject = "Thank you for contacting VistaForge"
    user_context = {
        'contact': contact_submission,
    }
    user_message = render_to_string('emails/contact_auto_reply.html', user_context)

    send_mail(
        subject=user_subject,
        message=user_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[contact_submission.email],
        html_message=user_message,
        fail_silently=False,
    )


def send_project_inquiry_notification(contact_submission):
    """
    Send specialized email for project inquiries
    """
    if contact_submission.project_type:
        subject = f"Project Inquiry: {contact_submission.project_type} from {contact_submission.name}"

        context = {
            'contact': contact_submission,
            'project_type': contact_submission.project_type,
            'budget_range': contact_submission.budget_range,
        }

        message = render_to_string('emails/project_inquiry.html', context)

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            html_message=message,
            fail_silently=False,
        )