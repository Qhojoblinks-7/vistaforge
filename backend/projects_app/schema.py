import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.conf import settings
from .models import Project, ProjectMilestone, ProjectTask, ProjectNote, ProjectFile, UserGoals
from clients_app.schema import ClientType
from typing import Dict, Any, List


# --- Authentication Mixin ---
class LoginRequiredMixin:
    """A mixin to ensure the user is authenticated for sensitive operations."""
    @classmethod
    def mutate(cls, root, info, **kwargs):
        if not info.context.user or not info.context.user.is_authenticated:
            raise Exception("Authentication required.")
        return super().mutate(root, info, **kwargs)


# --- GraphQL Types ---
class ProjectMilestoneType(DjangoObjectType):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'


class ProjectTaskType(DjangoObjectType):
    class Meta:
        model = ProjectTask
        fields = '__all__'


class ProjectNoteType(DjangoObjectType):
    class Meta:
        model = ProjectNote
        fields = '__all__'


class ProjectFileType(DjangoObjectType):
    class Meta:
        model = ProjectFile
        fields = '__all__'


class CaseStudyType(graphene.ObjectType):
    startingPoint = graphene.String()
    theTransformation = graphene.String()
    journeyEnd = graphene.String()
    visuals = graphene.List(graphene.String)


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project

    # Add computed fields
    # totalLoggedHours = graphene.Float()
    # totalCost = graphene.Float()
    # remainingHours = graphene.Float()
    # isOverBudget = graphene.Boolean()
    # daysUntilDeadline = graphene.Int()
    # totalTasks = graphene.Int()
    # Friendly aliases used by frontend
    name = graphene.String()
    caseStudy = graphene.JSONString()
    clientType = graphene.String()

    # def resolve_totalLoggedHours(self, info):
    #     return self.total_logged_hours / 60  # Convert minutes to hours

    # def resolve_totalCost(self, info):
    #     return self.total_cost

    # def resolve_remainingHours(self, info):
    #     return self.remaining_hours

    # def resolve_isOverBudget(self, info):
    #     return self.is_over_budget

    # def resolve_daysUntilDeadline(self, info):
    #     return self.days_until_deadline

    # def resolve_totalTasks(self, info):
    #     return self.projecttask_set.count()

    def resolve_name(self, info):
        return getattr(self, 'title', None)

    def resolve_caseStudy(self, info):
        # Return the JSON blob stored in the model as `case_study`
        return self.case_study or {}

    def resolve_clientType(self, info):
        return getattr(self, 'client_type', None)


# --- Input Types ---
class ProjectMilestoneInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    due_date = graphene.Date(required=True)
    status = graphene.String()
    order = graphene.Int()


class ProjectTaskInput(graphene.InputObjectType):
    milestone_id = graphene.ID()
    title = graphene.String(required=True)
    description = graphene.String()
    status = graphene.String()
    priority = graphene.String()
    assigned_to = graphene.String()
    estimated_hours = graphene.Float()
    order = graphene.Int()


class ProjectNoteInput(graphene.InputObjectType):
    note_type = graphene.String(required=True)
    title = graphene.String(required=True)
    content = graphene.String(required=True)
    is_internal = graphene.Boolean()


class ProjectFileInput(graphene.InputObjectType):
    file_type = graphene.String(required=True)
    title = graphene.String(required=True)
    file_name = graphene.String(required=True)
    file_path = graphene.String(required=True)
    file_size = graphene.Int(required=True)


class UserGoalsType(DjangoObjectType):
    class Meta:
        model = UserGoals
        fields = '__all__'


class UserGoalsInput(graphene.InputObjectType):
    monthly_revenue_target = graphene.Float()
    client_satisfaction_target = graphene.Float()
    current_client_satisfaction = graphene.Float()


class ProjectInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    client_id = graphene.ID(required=True)
    slug = graphene.String()
    intro = graphene.String()
    client_type = graphene.String()
    industry = graphene.String()
    logo = graphene.String()
    case_study = graphene.JSONString()
    status = graphene.String()
    project_phase = graphene.String()
    budget = graphene.Float()
    hourly_rate = graphene.Float()
    start_date = graphene.Date()
    end_date = graphene.Date()
    estimated_hours = graphene.Float()
    design_tools = graphene.List(graphene.String)
    technologies = graphene.List(graphene.String)
    priority = graphene.String()
    progress_percentage = graphene.Int()


# --- Queries ---
class ProjectQuery(graphene.ObjectType):
    # Projects
    all_projects = graphene.List(
        ProjectType,
        status=graphene.String(),
        client_id=graphene.ID(),
        phase=graphene.String(),
        priority=graphene.String(),
        is_active=graphene.Boolean(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    all_management_projects = graphene.List(
        ProjectType,
        status=graphene.String(),
        client_id=graphene.ID(),
        phase=graphene.String(),
        priority=graphene.String(),
        is_active=graphene.Boolean(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))

    # Project components
    project_milestones = graphene.List(ProjectMilestoneType, project_id=graphene.ID(required=True))
    project_tasks = graphene.List(ProjectTaskType, project_id=graphene.ID(required=True))
    project_notes = graphene.List(ProjectNoteType, project_id=graphene.ID(required=True))
    project_files = graphene.List(ProjectFileType, project_id=graphene.ID(required=True))

    # All tasks (for dashboard)
    all_tasks = graphene.List(ProjectTaskType, project_id=graphene.ID())

    # Analytics
    project_analytics = graphene.Field(graphene.JSONString)

    # User Goals
    user_goals = graphene.Field(UserGoalsType)
    business_analytics = graphene.Field(graphene.JSONString)

    @staticmethod
    def resolve_all_projects(root, info, status=None, client_id=None, phase=None, priority=None, is_active=None, limit=None, offset=None):
        # TEMPORARILY DISABLE AUTH FILTERING FOR DEBUGGING
        # Public listing: unauthenticated users should see active projects only
        # if not info.context.user.is_authenticated:
        #     queryset = Project.objects.filter(is_active=True)
        # else:
        #     # Authenticated users see their own projects (management view)
        #     queryset = Project.objects.filter(user=info.context.user)
        queryset = Project.objects.all()  # Show all projects for debugging

        if status:
            queryset = queryset.filter(status=status)
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if phase:
            queryset = queryset.filter(project_phase=phase)
        if priority:
            queryset = queryset.filter(priority=priority)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    @staticmethod
    def resolve_all_management_projects(root, info, status=None, client_id=None, phase=None, priority=None, is_active=None, limit=None, offset=None):
        # TEMPORARILY DISABLE AUTH FILTERING FOR DEBUGGING
        # Management view: authenticated users see their own projects
        # if not info.context.user.is_authenticated:
        #     return Project.objects.none()
        # queryset = Project.objects.filter(user=info.context.user)
        queryset = Project.objects.all()  # Show all projects for debugging

        if status:
            queryset = queryset.filter(status=status)
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if phase:
            queryset = queryset.filter(project_phase=phase)
        if priority:
            queryset = queryset.filter(priority=priority)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        if limit:
            if offset:
                queryset = queryset[offset:offset + limit]
            else:
                queryset = queryset[:limit]

        return queryset

    @staticmethod
    def resolve_project(root, info, id):
        # Public project detail for active projects, otherwise require ownership
        project = get_object_or_404(Project, pk=id)
        if not info.context.user.is_authenticated and not project.is_active:
            return None
        if info.context.user.is_authenticated and project.user != info.context.user:
            # Authenticated users can only access their own management projects
            return None
        return project

    @staticmethod
    def resolve_project_milestones(root, info, project_id):
        if not info.context.user.is_authenticated:
            return ProjectMilestone.objects.none()
        return ProjectMilestone.objects.filter(project_id=project_id, project__user=info.context.user)

    @staticmethod
    def resolve_project_tasks(root, info, project_id):
        if not info.context.user.is_authenticated:
            return ProjectTask.objects.none()
        return ProjectTask.objects.filter(project_id=project_id, project__user=info.context.user)

    @staticmethod
    def resolve_project_notes(root, info, project_id):
        if not info.context.user.is_authenticated:
            return ProjectNote.objects.none()
        return ProjectNote.objects.filter(project_id=project_id, project__user=info.context.user)

    @staticmethod
    def resolve_project_files(root, info, project_id):
        if not info.context.user.is_authenticated:
            return ProjectFile.objects.none()
        return ProjectFile.objects.filter(project_id=project_id, project__user=info.context.user)

    @staticmethod
    def resolve_all_tasks(root, info, project_id=None):
        if not info.context.user.is_authenticated:
            return ProjectTask.objects.none()
        queryset = ProjectTask.objects.filter(project__user=info.context.user)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    @staticmethod
    def resolve_project_analytics(root, info):
        if not info.context.user.is_authenticated:
            return {}

        projects = Project.objects.filter(user=info.context.user)

        total_projects = projects.count()
        active_projects = projects.filter(is_active=True).count()
        completed_projects = projects.filter(status='COMPLETED').count()
        total_budget = sum(float(p.budget) for p in projects)
        total_value = sum(p.total_cost for p in projects)

        return {
            'totalProjects': total_projects,
            'activeProjects': active_projects,
            'completedProjects': completed_projects,
            'totalBudget': float(total_budget),
            'totalValue': float(total_value),
        }


# --- Mutations ---
class CreateProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = ProjectInput(required=True)

    project = graphene.Field(ProjectType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, input):
        user = info.context.user
        client_id = input.pop('client_id')

        # Verify client belongs to user
        from clients_app.models import Client
        client = get_object_or_404(Client, pk=client_id, user=user)

        project = Project.objects.create(user=user, client=client, **input)
        return CreateProject(project=project)


class UpdateProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectInput(required=True)

    project = graphene.Field(ProjectType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        project = get_object_or_404(Project, pk=id, user=user)

        client_id = input.pop('client_id', None)
        if client_id:
            # Verify client belongs to user
            from clients_app.models import Client
            client = get_object_or_404(Client, pk=client_id, user=user)
            project.client = client

        for field, value in input.items():
            setattr(project, field, value)
        project.save()

        return UpdateProject(project=project)


class DeleteProject(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        project = get_object_or_404(Project, pk=id, user=user)
        project.delete()
        return DeleteProject(success=True)


class CreateProjectMilestone(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        input = ProjectMilestoneInput(required=True)

    milestone = graphene.Field(ProjectMilestoneType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, project_id, input):
        user = info.context.user
        project = get_object_or_404(Project, pk=project_id, user=user)

        milestone = ProjectMilestone.objects.create(project=project, **input)
        return CreateProjectMilestone(milestone=milestone)


class UpdateProjectMilestone(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectMilestoneInput(required=True)

    milestone = graphene.Field(ProjectMilestoneType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        milestone = get_object_or_404(ProjectMilestone, pk=id, project__user=user)

        for field, value in input.items():
            setattr(milestone, field, value)
        milestone.save()

        return UpdateProjectMilestone(milestone=milestone)


class DeleteProjectMilestone(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        milestone = get_object_or_404(ProjectMilestone, pk=id, project__user=user)
        milestone.delete()
        return DeleteProjectMilestone(success=True)


class CreateProjectTask(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        input = ProjectTaskInput(required=True)

    task = graphene.Field(ProjectTaskType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, project_id, input):
        user = info.context.user
        project = get_object_or_404(Project, pk=project_id, user=user)

        milestone_id = input.pop('milestone_id', None)
        milestone = None
        if milestone_id:
            milestone = get_object_or_404(ProjectMilestone, pk=milestone_id, project=project)

        task = ProjectTask.objects.create(project=project, milestone=milestone, **input)
        return CreateProjectTask(task=task)


class UpdateProjectTask(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectTaskInput(required=True)

    task = graphene.Field(ProjectTaskType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        task = get_object_or_404(ProjectTask, pk=id, project__user=user)

        milestone_id = input.pop('milestone_id', None)
        if milestone_id:
            milestone = get_object_or_404(ProjectMilestone, pk=milestone_id, project=task.project)
            task.milestone = milestone
        elif milestone_id is None:
            task.milestone = None

        for field, value in input.items():
            setattr(task, field, value)
        task.save()

        return UpdateProjectTask(task=task)


class DeleteProjectTask(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        task = get_object_or_404(ProjectTask, pk=id, project__user=user)
        task.delete()
        return DeleteProjectTask(success=True)


class CreateProjectNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        input = ProjectNoteInput(required=True)

    note = graphene.Field(ProjectNoteType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, project_id, input):
        user = info.context.user
        project = get_object_or_404(Project, pk=project_id, user=user)

        note = ProjectNote.objects.create(project=project, user=user, **input)
        return CreateProjectNote(note=note)


class UpdateProjectNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectNoteInput(required=True)

    note = graphene.Field(ProjectNoteType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        note = get_object_or_404(ProjectNote, pk=id, project__user=user)

        for field, value in input.items():
            setattr(note, field, value)
        note.save()

        return UpdateProjectNote(note=note)


class DeleteProjectNote(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        note = get_object_or_404(ProjectNote, pk=id, project__user=user)
        note.delete()
        return DeleteProjectNote(success=True)


class CreateProjectFile(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        input = ProjectFileInput(required=True)

    file = graphene.Field(ProjectFileType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, project_id, input):
        user = info.context.user
        project = get_object_or_404(Project, pk=project_id, user=user)

        file_obj = ProjectFile.objects.create(project=project, user=user, **input)
        return CreateProjectFile(file=file_obj)


class UpdateProjectFile(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ProjectFileInput(required=True)

    file = graphene.Field(ProjectFileType)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id, input):
        user = info.context.user
        file_obj = get_object_or_404(ProjectFile, pk=id, project__user=user)

        for field, value in input.items():
            setattr(file_obj, field, value)
        file_obj.save()

        return UpdateProjectFile(file=file_obj)


class DeleteProjectFile(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, id):
        user = info.context.user
        file_obj = get_object_or_404(ProjectFile, pk=id, project__user=user)
        file_obj.delete()
        return DeleteProjectFile(success=True)


# --- Mutation Aggregation ---
class UpdateUserGoals(LoginRequiredMixin, graphene.Mutation):
    class Arguments:
        input = UserGoalsInput(required=True)

    goals = graphene.Field(UserGoalsType)

    @classmethod
    def mutate(cls, root, info, input):
        user = info.context.user
        goals, created = UserGoals.objects.get_or_create(user=user)

        for field, value in input.items():
            if value is not None:
                setattr(goals, field, value)
        goals.save()

        return UpdateUserGoals(goals=goals)


class ProjectMutation(graphene.ObjectType):
    # Project mutations
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()

    # Project milestone mutations
    create_project_milestone = CreateProjectMilestone.Field()
    update_project_milestone = UpdateProjectMilestone.Field()
    delete_project_milestone = DeleteProjectMilestone.Field()

    # Project task mutations
    create_project_task = CreateProjectTask.Field()
    update_project_task = UpdateProjectTask.Field()
    delete_project_task = DeleteProjectTask.Field()

    # Project note mutations
    create_project_note = CreateProjectNote.Field()
    update_project_note = UpdateProjectNote.Field()
    delete_project_note = DeleteProjectNote.Field()

    # Project file mutations
    create_project_file = CreateProjectFile.Field()
    update_project_file = UpdateProjectFile.Field()
    delete_project_file = DeleteProjectFile.Field()

    # User goals mutations
    update_user_goals = UpdateUserGoals.Field()