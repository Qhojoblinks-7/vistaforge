import graphene
from .types import ContactSubmissionType
from .models import ContactSubmission

class ContactMutation(graphene.Mutation):
    """Allows unauthenticated users to submit a contact form."""
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        message = graphene.String(required=True)

    # The output field is the newly created ContactSubmission
    contact_submission = graphene.Field(ContactSubmissionType)

    @classmethod
    def mutate(cls, root, info, name, email, message):
        # 1. Input Validation
        if not all([name, email, message]):
             raise Exception("All fields are required.")

        # 2. Transactional Integrity (Database Write)
        submission = ContactSubmission.objects.create(
            name=name,
            email=email,
            message=message
        )

        # NOTE: You would trigger the automated email response here (e.g., via Django signals or Celery)

        return ContactMutation(contact_submission=submission)