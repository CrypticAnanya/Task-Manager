from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "assigned_to", "priority", "status", "due_date")
    list_filter = ("priority", "status", "due_date")
    search_fields = ("title", "description", "project__title", "assigned_to__email")
