import { Router } from "express";

import { authenticate } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { isOverdue } from "../utils/formatters.js";

export const dashboardRouter = Router();

function projectWhereFor(user) {
  return user.role === "ADMIN" ? {} : { members: { some: { userId: user.id } } };
}

function taskWhereFor(user) {
  return user.role === "ADMIN" ? {} : { OR: [{ assigneeId: user.id }, { project: { members: { some: { userId: user.id } } } }] };
}

dashboardRouter.get("/", authenticate, async (req, res) => {
  const [projects, tasks, activities] = await Promise.all([
    prisma.project.findMany({ where: projectWhereFor(req.user), include: { tasks: true } }),
    prisma.task.findMany({ where: taskWhereFor(req.user), include: { project: true, assignee: true } }),
    prisma.activityEvent.findMany({
      where: req.user.role === "ADMIN" ? {} : { OR: [{ userId: req.user.id }, { project: { members: { some: { userId: req.user.id } } } }] },
      include: { user: true, project: true, task: true },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const statusCounts = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, COMPLETED: 0 };
  const priorityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
  tasks.forEach((task) => {
    statusCounts[task.status] += 1;
    priorityCounts[task.priority] += 1;
  });

  res.json({
    totalProjects: projects.length,
    total_projects: projects.length,
    totalTasks: tasks.length,
    total_tasks: tasks.length,
    completedTasks: completed,
    completed_tasks: completed,
    pendingTasks: tasks.length - completed,
    pending_tasks: tasks.length - completed,
    overdueTasks: tasks.filter((task) => isOverdue(task.dueDate, task.status)).length,
    overdue_tasks: tasks.filter((task) => isOverdue(task.dueDate, task.status)).length,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    completion_rate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    statusCounts,
    status_counts: statusCounts,
    priorityCounts,
    priority_counts: priorityCounts,
    projectProgress: projects.map((project) => {
      const done = project.tasks.filter((task) => task.status === "COMPLETED").length;
      return { name: project.title, progress: project.tasks.length ? Math.round((done / project.tasks.length) * 100) : 0, tasks: project.tasks.length };
    }),
    project_progress: projects.map((project) => {
      const done = project.tasks.filter((task) => task.status === "COMPLETED").length;
      return { name: project.title, progress: project.tasks.length ? Math.round((done / project.tasks.length) * 100) : 0, tasks: project.tasks.length };
    }),
    myTasks: tasks.filter((task) => task.assigneeId === req.user.id).slice(0, 6),
    my_tasks: tasks.filter((task) => task.assigneeId === req.user.id).slice(0, 6),
    recentActivity: activities.map((event) => ({
      id: event.id,
      title: event.detail,
      project: event.project?.title ?? "Workspace",
      status: event.task?.status ?? "UPDATED",
      assigned_to: event.task?.assignee?.fullName ?? event.user.fullName,
      updated_at: event.createdAt
    })),
    recent_activity: activities.map((event) => ({
      id: event.id,
      title: event.detail,
      project: event.project?.title ?? "Workspace",
      status: event.task?.status ?? "UPDATED",
      assigned_to: event.task?.assignee?.fullName ?? event.user.fullName,
      updated_at: event.createdAt
    }))
  });
});
