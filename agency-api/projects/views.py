from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Project, ContactSubmission, MapMarker, Task, Milestone
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    ContactSubmissionSerializer,
    MapMarkerSerializer,
    TaskSerializer,
    MilestoneSerializer
)
from .utils import send_contact_notification, send_project_inquiry_notification


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for portfolio projects"""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]

    def get_serializer_class(self):
        """Use different serializers for list vs detail views"""
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """Filter queryset based on query parameters"""
        # For authenticated users, show all projects; for public, only active ones
        if self.request.user.is_authenticated:
            queryset = Project.objects.all()
        else:
            queryset = Project.objects.filter(is_active=True)

        # Filter by project type
        project_type = self.request.query_params.get('type', None)
        if project_type:
            queryset = queryset.filter(project_type=project_type)

        # Filter by industry
        industry = self.request.query_params.get('industry', None)
        if industry:
            queryset = queryset.filter(industry=industry)

        # Filter design projects
        is_design = self.request.query_params.get('design', None)
        if is_design == 'true':
            queryset = queryset.filter(project_type='design') | queryset.exclude(design_tools=[])

        return queryset.order_by('order', '-created_at')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects (first 3)"""
        projects = self.get_queryset()[:3]
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def design_projects(self, request):
        """Get only design projects"""
        projects = self.get_queryset().filter(
            models.Q(project_type='design') | models.Q(design_tools__isnull=False)
        ).exclude(design_tools=[])
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        """Get related projects by industry"""
        project = self.get_object()
        related_projects = self.get_queryset().filter(
            industry=project.industry
        ).exclude(id=project.id)[:3]

        serializer = self.get_serializer(related_projects, many=True)
        return Response(serializer.data)


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for project tasks"""

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        """Require authentication for all operations"""
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter tasks by project if specified"""
        queryset = Task.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset.order_by('order', 'due_date')


class MilestoneViewSet(viewsets.ModelViewSet):
    """ViewSet for project milestones"""

    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        """Require authentication for all operations"""
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter milestones by project if specified"""
        queryset = Milestone.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset.order_by('order', 'target_date')


class AuthViewSet(viewsets.ViewSet):
    """ViewSet for authentication"""

    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Authenticate user and return token"""
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user by deleting token"""
        if request.auth:
            request.auth.delete()
        return Response({'message': 'Successfully logged out'})


class ContactViewSet(viewsets.ModelViewSet):
    """ViewSet for contact form submissions"""

    queryset = ContactSubmission.objects.all().order_by('-submitted_at')
    serializer_class = ContactSubmissionSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        """Allow anyone to create contact submissions, but restrict other operations"""
        if self.action == 'create':
            return [AllowAny()]  # Allow anyone to create
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """Handle contact form submission"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()

        # Send email notifications
        try:
            send_contact_notification(contact)
            if contact.project_type:
                send_project_inquiry_notification(contact)
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Email sending failed: {e}")

        return Response({
            'message': 'Thank you for your message. We\'ll get back to you soon!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread contact submissions"""
        unread = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread, many=True)
        return Response({
            'count': unread.count(),
            'submissions': serializer.data
        })

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a contact submission as read"""
        contact = self.get_object()
        contact.is_read = True
        contact.save()
        return Response({'message': 'Marked as read'})


class MapMarkerViewSet(viewsets.ModelViewSet):
    """ViewSet for map markers"""
    queryset = MapMarker.objects.filter(is_active=True)
    serializer_class = MapMarkerSerializer

    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = MapMarker.objects.filter(is_active=True)

        marker_type = self.request.query_params.get('type', None)
        if marker_type:
            queryset = queryset.filter(marker_type=marker_type)

        # Order by display_order, then by creation date
        return queryset.order_by('display_order', '-created_at')

    @action(detail=False, methods=['get'])
    def bounds(self, request):
        """Get map bounds containing all markers"""
        markers = self.get_queryset()
        if not markers:
            return Response({
                'bounds': {
                    'north': 0,
                    'south': 0,
                    'east': 0,
                    'west': 0
                },
                'center': {
                    'lat': 0,
                    'lng': 0
                }
            })

        latitudes = [m.latitude for m in markers]
        longitudes = [m.longitude for m in markers]

        return Response({
            'bounds': {
                'north': max(latitudes),
                'south': min(latitudes),
                'east': max(longitudes),
                'west': min(longitudes)
            },
            'center': {
                'lat': sum(latitudes) / len(latitudes),
                'lng': sum(longitudes) / len(longitudes)
            }
        })

    @action(detail=False, methods=['get'])
    def clusters(self, request):
        """Get clustered markers for map display"""
        # This would implement marker clustering logic
        # For now, return all markers
        markers = self.get_queryset()
        serializer = self.get_serializer(markers, many=True)
        return Response(serializer.data)
