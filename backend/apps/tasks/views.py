from django.db.models import Q
from rest_framework import viewsets

from apps.accounts.models import UserRole
from apps.accounts.permissions import IsAdminOrReadOnly

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ("status", "priority", "project", "assigned_to")
    search_fields = ("title", "description", "project__title")
    ordering_fields = ("due_date", "created_at", "priority", "status")

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.select_related("project", "assigned_to", "created_by")
        if user.role == UserRole.ADMIN:
            return queryset
        return queryset.filter(Q(assigned_to=user) | Q(created_by=user) | Q(project__members=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
