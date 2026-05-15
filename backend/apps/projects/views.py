from django.db.models import Count, Q
from rest_framework import viewsets

from apps.accounts.models import UserRole
from apps.accounts.permissions import IsAdminOrReadOnly

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "due_date", "title")

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.select_related("created_by").prefetch_related("members").annotate(
            task_count=Count("tasks", distinct=True),
            completed_task_count=Count("tasks", filter=Q(tasks__status="DONE"), distinct=True),
        )
        if user.role == UserRole.ADMIN:
            return queryset.order_by("-created_at")
        return queryset.filter(Q(created_by=user) | Q(members=user)).distinct().order_by("-created_at")

    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        project.members.add(self.request.user)
