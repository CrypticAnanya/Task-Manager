from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.projects.models import Project
from apps.projects.serializers import MemberSerializer

from .models import Task

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = MemberSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="assigned_to", write_only=True, required=False, allow_null=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source="project", write_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)
    created_by = MemberSerializer(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "status",
            "due_date",
            "assigned_to",
            "assigned_to_id",
            "project_id",
            "project_title",
            "created_by",
            "is_overdue",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at")
