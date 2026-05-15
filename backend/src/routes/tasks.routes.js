import { Router } from "express";

import { authenticate, requireAdmin } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { taskDto } from "../utils/formatters.js";
import { taskSchema, taskUpdateSchema } from "../validators/schemas.js";

export const tasksRouter = Router();

const include = { project: true, assignee: true };

function taskWhereFor(user) {
  return user.role === "ADMIN" ? {} : { OR: [{ assigneeId: user.id }, { project: { members: { some: { userId: user.id } } } }] };
}

async function logActivity(userId, projectId, taskId, action, detail) {
  await prisma.activityEvent.create({ data: { userId, projectId, taskId, action, detail } });
}

tasksRouter.use(authenticate);

tasksRouter.get("/", async (req, res) => {
  const { status, priority, assignee, due, search } = req.query;
  const tasks = await prisma.task.findMany({
    where: {
      ...taskWhereFor(req.user),
      ...(status ? { status: status.toString() } : {}),
      ...(priority ? { priority: priority.toString() } : {}),
      ...(assignee ? { assigneeId: Number(assignee) } : {}),
      ...(due ? { dueDate: { lte: new Date(due.toString()) } } : {}),
      ...(search ? { OR: [{ title: { contains: search.toString(), mode: "insensitive" } }, { description: { contains: search.toString(), mode: "insensitive" } }] } : {})
    },
    include,
    orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }]
  });
  const results = tasks.map(taskDto);
  res.json({ count: results.length, results });
});

tasksRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const payload = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        projectId: payload.projectId,
        assigneeId: payload.assigneeId,
        createdById: req.user.id
      },
      include
    });
    if (payload.assigneeId) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: payload.projectId, userId: payload.assigneeId } },
        create: { projectId: payload.projectId, userId: payload.assigneeId },
        update: {}
      });
    }
    await logActivity(req.user.id, task.projectId, task.id, "TASK_CREATED", `created ${task.title}`);
    res.status(201).json(taskDto(task));
  } catch (error) {
    next(error);
  }
});

tasksRouter.put("/:id", async (req, res, next) => {
  try {
    const current = await prisma.task.findUnique({ where: { id: Number(req.params.id) }, include: { project: { include: { members: true } } } });
    if (!current) return res.status(404).json({ message: "Task not found" });
    const isAssignedMember = current.assigneeId === req.user.id || current.project.members.some((member) => member.userId === req.user.id);
    if (req.user.role !== "ADMIN" && !isAssignedMember) return res.status(403).json({ message: "Not allowed" });

    const payload = taskUpdateSchema.parse(req.body);
    const data = req.user.role === "ADMIN"
      ? {
          title: payload.title,
          description: payload.description,
          status: payload.status,
          priority: payload.priority,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : payload.dueDate,
          projectId: payload.projectId,
          assigneeId: payload.assigneeId
        }
      : { status: payload.status };

    const task = await prisma.task.update({ where: { id: current.id }, data, include });
    await logActivity(req.user.id, task.projectId, task.id, "TASK_UPDATED", `updated ${task.title}`);
    res.json(taskDto(task));
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
