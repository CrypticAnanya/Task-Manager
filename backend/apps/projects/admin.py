from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "due_date", "created_at")
    search_fields = ("title", "description", "created_by__email")
    list_filter = ("due_date", "created_at")
    filter_horizontal = ("members",)
