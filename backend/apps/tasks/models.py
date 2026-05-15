from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.projects.models import Project


class TaskPriority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"


class TaskStatus(models.TextChoices):
    TODO = "TODO", "To do"
    IN_PROGRESS = "IN_PROGRESS", "In progress"
    REVIEW = "REVIEW", "Review"
    DONE = "DONE", "Done"


class Task(models.Model):
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=12, choices=TaskPriority.choices, default=TaskPriority.MEDIUM)
    status = models.CharField(max_length=20, choices=TaskStatus.choices, default=TaskStatus.TODO)
    due_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_tasks")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_tasks")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["due_date", "-created_at"]

    def __str__(self) -> str:
        return self.title

    @property
    def is_overdue(self) -> bool:
        return bool(self.due_date and self.status != TaskStatus.DONE and self.due_date < timezone.localdate())
