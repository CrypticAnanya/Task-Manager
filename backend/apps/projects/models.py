from django.conf import settings
from django.db import models
from django.utils import timezone


class Project(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_projects")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="projects", blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
