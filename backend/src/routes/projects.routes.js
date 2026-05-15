import { Router } from "express";

import { authenticate, requireAdmin } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { projectDto } from "../utils/formatters.js";
import { projectSchema, projectUpdateSchema } from "../validators/schemas.js";

export const projectsRouter = Router();

const include = {
  createdBy: true,
  members: { include: { user: true } },
  tasks: true
};

function projectWhereFor(user) {
  return user.role === "ADMIN" ? {} : { members: { some: { userId: user.id } } };
}

async function logActivity(userId, projectId, action, detail) {
  await prisma.activityEvent.create({ data: { userId, projectId, action, detail } });
}

projectsRouter.use(authenticate);

projectsRouter.get("/", async (req, res) => {
  const search = req.query.search?.toString();
  const projects = await prisma.project.findMany({
    where: {
      ...projectWhereFor(req.user),
      ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }] } : {})
    },
    include,
    orderBy: { updatedAt: "desc" }
  });
  const results = projects.map(projectDto);
  res.json({ count: results.length, results });
});

projectsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const payload = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline ? new Date(payload.deadline) : null,
        status: payload.status,
        priority: payload.priority,
        createdById: req.user.id,
        members: {
          create: Array.from(new Set([req.user.id, ...payload.memberIds])).map((userId) => ({ userId }))
        }
      },
      include
    });
    await logActivity(req.user.id, project.id, "PROJECT_CREATED", `created ${project.title}`);
    res.status(201).json(projectDto(project));
  } catch (error) {
    next(error);
  }
});

projectsRouter.get("/:id", async (req, res) => {
  const project = await prisma.project.findFirst({ where: { id: Number(req.params.id), ...projectWhereFor(req.user) }, include });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(projectDto(project));
});

projectsRouter.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const payload = projectUpdateSchema.parse(req.body);
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline ? new Date(payload.deadline) : payload.deadline,
        status: payload.status,
        priority: payload.priority,
        ...(payload.memberIds ? {
          members: {
            deleteMany: {},
            create: Array.from(new Set([req.user.id, ...payload.memberIds])).map((userId) => ({ userId }))
          }
        } : {})
      },
      include
    });
    await logActivity(req.user.id, project.id, "PROJECT_UPDATED", `updated ${project.title}`);
    res.json(projectDto(project));
  } catch (error) {
    next(error);
  }
});

projectsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
