from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import UserRole
from apps.projects.models import Project
from apps.tasks.models import Task


class DashboardSummaryView(APIView):
    def get(self, request):
        user = request.user
        projects = Project.objects.all()
        tasks = Task.objects.select_related("project", "assigned_to")
        if user.role != UserRole.ADMIN:
            projects = projects.filter(Q(created_by=user) | Q(members=user)).distinct()
            tasks = tasks.filter(Q(assigned_to=user) | Q(created_by=user) | Q(project__members=user)).distinct()

        today = timezone.localdate()
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status="DONE").count()
        overdue_tasks = tasks.filter(due_date__lt=today).exclude(status="DONE").count()

        status_counts = {row["status"]: row["count"] for row in tasks.values("status").annotate(count=Count("id"))}
        priority_counts = {row["priority"]: row["count"] for row in tasks.values("priority").annotate(count=Count("id"))}
        project_progress = []
        for project in projects.annotate(task_count=Count("tasks"), done_count=Count("tasks", filter=Q(tasks__status="DONE"))).order_by("-created_at")[:8]:
            progress = round((project.done_count / project.task_count) * 100) if project.task_count else 0
            project_progress.append({"name": project.title, "progress": progress, "tasks": project.task_count})

        recent_activity = [
            {
                "id": task.id,
                "title": task.title,
                "project": task.project.title,
                "status": task.status,
                "assigned_to": task.assigned_to.full_name if task.assigned_to else "Unassigned",
                "updated_at": task.updated_at,
            }
            for task in tasks.order_by("-updated_at")[:6]
        ]

        return Response(
            {
                "total_projects": projects.count(),
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "overdue_tasks": overdue_tasks,
                "completion_rate": round((completed_tasks / total_tasks) * 100) if total_tasks else 0,
                "status_counts": status_counts,
                "priority_counts": priority_counts,
                "project_progress": project_progress,
                "recent_activity": recent_activity,
            }
        )
