from rest_framework import serializers
from .models import Project, ProjectImage, ContactSubmission, MapMarker, Task, Milestone


class ProjectImageSerializer(serializers.ModelSerializer):
    """Serializer for project images"""

    class Meta:
        model = ProjectImage
        fields = ['id', 'title', 'image_url', 'alt_text', 'order']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects with all necessary fields"""

    images = ProjectImageSerializer(many=True, read_only=True)
    design_tools_display = serializers.SerializerMethodField()
    is_design_project = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'slug', 'client_type', 'industry', 'intro', 'logo',
            'project_type', 'design_tools', 'design_tools_display', 'is_design_project',
            'starting_point', 'the_transformation', 'journey_end', 'visuals',
            'deliverables', 'design_system', 'images',
            'is_active', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for project tasks"""

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'name', 'status', 'assigned_to',
            'due_date', 'description', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MilestoneSerializer(serializers.ModelSerializer):
    """Serializer for project milestones"""

    class Meta:
        model = Milestone
        fields = [
            'id', 'project', 'name', 'target_date', 'is_reached',
            'description', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_design_tools_display(self, obj):
        """Return formatted design tools names"""
        return obj.get_design_tools_display()


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project listings"""

    design_tools_display = serializers.SerializerMethodField()
    is_design_project = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'slug', 'client_type', 'industry', 'intro', 'logo',
            'project_type', 'design_tools', 'design_tools_display', 'is_design_project',
            'is_active', 'order'
        ]

    def get_design_tools_display(self, obj):
        """Return formatted design tools names"""
        return obj.get_design_tools_display()


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for contact form submissions"""

    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'name', 'email', 'company', 'message',
            'project_type', 'budget_range',
            'latitude', 'longitude', 'location_name', 'ip_address',
            'submitted_at', 'is_read', 'responded_at'
        ]
        read_only_fields = ['id', 'submitted_at', 'is_read', 'responded_at']

    def create(self, validated_data):
        """Create contact submission"""
        return ContactSubmission.objects.create(**validated_data)


class MapMarkerSerializer(serializers.ModelSerializer):
    """Serializer for map markers"""
    related_project_title = serializers.CharField(source='related_project.name', read_only=True)
    related_contact_name = serializers.CharField(source='related_contact.name', read_only=True)

    class Meta:
        model = MapMarker
        fields = [
            'id', 'title', 'description', 'latitude', 'longitude', 'location_name',
            'marker_type', 'related_project', 'related_contact', 'is_active',
            'display_order', 'created_at', 'updated_at',
            'related_project_title', 'related_contact_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']