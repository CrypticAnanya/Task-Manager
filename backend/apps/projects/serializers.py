from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project

User = get_user_model()


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "email", "role")


class ProjectSerializer(serializers.ModelSerializer):
    created_by = MemberSerializer(read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, write_only=True, required=False, source="members")
    members = MemberSerializer(many=True, read_only=True)
    task_count = serializers.IntegerField(read_only=True)
    completed_task_count = serializers.IntegerField(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "due_date",
            "created_by",
            "members",
            "member_ids",
            "task_count",
            "completed_task_count",
            "progress",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at")

    def get_progress(self, obj):
        task_count = getattr(obj, "task_count", 0) or 0
        completed = getattr(obj, "completed_task_count", 0) or 0
        return round((completed / task_count) * 100) if task_count else 0
