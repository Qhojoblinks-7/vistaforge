import graphene
from .types import ContactSubmissionType
from .models import ContactSubmission, Project
from .decorators import superuser_only

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
        print("📝 Public mutation: submitContact - No authentication required")
        # 1. Input Validation
        if not all([name, email, message]):
             raise Exception("All fields are required.")

        # 2. Transactional Integrity (Database Write)
        submission = ContactSubmission.objects.create(
            name=name,
            email=email,
            message=message
        )

        print(f"✅ Contact submission created: {submission.name} - {submission.email}")
        # NOTE: You would trigger the automated email response here (e.g., via Django signals or Celery)

        return ContactMutation(contact_submission=submission)


class ProjectCreateInput(graphene.InputObjectType):
    """Input type for creating a new project."""
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    client_type = graphene.String(required=True)
    industry = graphene.String(required=True)
    intro = graphene.String(required=True)
    logo = graphene.String(required=True)
    project_type = graphene.String(required=True)
    design_tools = graphene.List(graphene.String)
    starting_point = graphene.String(required=True)
    the_transformation = graphene.String(required=True)
    journey_end = graphene.String(required=True)
    visuals = graphene.JSONString()
    deliverables = graphene.List(graphene.String)
    design_system = graphene.JSONString()
    is_active = graphene.Boolean()
    order = graphene.Int()


class ProjectUpdateInput(graphene.InputObjectType):
    """Input type for updating an existing project."""
    name = graphene.String()
    slug = graphene.String()
    client_type = graphene.String()
    industry = graphene.String()
    intro = graphene.String()
    logo = graphene.String()
    project_type = graphene.String()
    design_tools = graphene.List(graphene.String)
    starting_point = graphene.String()
    the_transformation = graphene.String()
    journey_end = graphene.String()
    visuals = graphene.JSONString()
    deliverables = graphene.List(graphene.String)
    design_system = graphene.JSONString()
    is_active = graphene.Boolean()
    order = graphene.Int()


class CreateProjectMutation(graphene.Mutation):
    """Mutation to create a new project (admin only)."""
    class Arguments:
        project_data = ProjectCreateInput(required=True)

    project = graphene.Field('projects.schema.ProjectType')
    errors = graphene.List(graphene.NonNull(graphene.String))

    @classmethod
    @superuser_only
    def mutate(cls, root, info, project_data):
        print("Admin mutation: createProject - Authentication passed")

        try:
            # Create the project
            project = Project.objects.create(
                name=project_data.name,
                slug=project_data.slug,
                client_type=project_data.client_type,
                industry=project_data.industry,
                intro=project_data.intro,
                logo=project_data.logo,
                project_type=project_data.project_type,
                design_tools=project_data.design_tools or [],
                starting_point=project_data.starting_point,
                the_transformation=project_data.the_transformation,
                journey_end=project_data.journey_end,
                visuals=project_data.visuals or {},
                deliverables=project_data.deliverables or [],
                design_system=project_data.design_system or {},
                is_active=project_data.get('is_active', True),
                order=project_data.get('order', 0),
            )

            print(f"Project created: {project.name} (ID: {project.id})")
            return CreateProjectMutation(project=project, errors=None)

        except Exception as e:
            print(f"Project creation failed: {str(e)}")
            return CreateProjectMutation(project=None, errors=[str(e)])


class UpdateProjectMutation(graphene.Mutation):
    """Mutation to update an existing project (admin only)."""
    class Arguments:
        id = graphene.ID(required=True)
        project_data = ProjectUpdateInput(required=True)

    project = graphene.Field('projects.schema.ProjectType')
    errors = graphene.List(graphene.NonNull(graphene.String))

    @classmethod
    @superuser_only
    def mutate(cls, root, info, id, project_data):
        print("Admin mutation: updateProject - Authentication passed")

        try:
            project = Project.objects.get(id=id)

            # Update fields
            for field, value in project_data.items():
                if value is not None:
                    setattr(project, field, value)

            project.save()
            print(f"Project updated: {project.name} (ID: {project.id})")
            return UpdateProjectMutation(project=project, errors=None)

        except Project.DoesNotExist:
            error_msg = f"Project with ID {id} does not exist"
            print(f"Project update failed: {error_msg}")
            return UpdateProjectMutation(project=None, errors=[error_msg])
        except Exception as e:
            print(f"Project update failed: {str(e)}")
            return UpdateProjectMutation(project=None, errors=[str(e)])


class DeleteProjectMutation(graphene.Mutation):
    """Mutation to delete a project (admin only)."""
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.NonNull(graphene.String))

    @classmethod
    @superuser_only
    def mutate(cls, root, info, id):
        print("Admin mutation: deleteProject - Authentication passed")

        try:
            project = Project.objects.get(id=id)
            project_name = project.name
            project.delete()

            print(f"Project deleted: {project_name} (ID: {id})")
            return DeleteProjectMutation(success=True, errors=None)

        except Project.DoesNotExist:
            error_msg = f"Project with ID {id} does not exist"
            print(f"Project deletion failed: {error_msg}")
            return DeleteProjectMutation(success=False, errors=[error_msg])
        except Exception as e:
            print(f"Project deletion failed: {str(e)}")
            return DeleteProjectMutation(success=False, errors=[str(e)])