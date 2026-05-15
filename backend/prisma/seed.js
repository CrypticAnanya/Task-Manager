import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("AdminPass123!", 12);
  const memberHash = await bcrypt.hash("MemberPass123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@taskmanager.dev" },
    update: {},
    create: { fullName: "Avery Admin", email: "admin@taskmanager.dev", passwordHash, role: "ADMIN" }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@taskmanager.dev" },
    update: {},
    create: { fullName: "Maya Member", email: "member@taskmanager.dev", passwordHash: memberHash, role: "MEMBER" }
  });

  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Interview Launch Plan",
      description: "A polished demo workspace for planning milestones, assigning work, and showing role-based operations.",
      priority: "HIGH",
      status: "ACTIVE",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      createdById: admin.id,
      members: { create: [{ userId: admin.id }, { userId: member.id }] }
    }
  });

  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    await prisma.task.createMany({
      data: [
        { title: "Finalize project scope", description: "Lock down app flows and acceptance criteria.", priority: "HIGH", status: "COMPLETED", dueDate: new Date(Date.now() - 86400000), projectId: project.id, assigneeId: admin.id, createdById: admin.id },
        { title: "Design dashboard metrics", description: "Add charts, cards, and recent activity.", priority: "HIGH", status: "IN_PROGRESS", dueDate: new Date(Date.now() + 172800000), projectId: project.id, assigneeId: member.id, createdById: admin.id },
        { title: "Prepare deployment checklist", description: "Document Railway variables and frontend deployment.", priority: "MEDIUM", status: "TODO", dueDate: new Date(Date.now() + 432000000), projectId: project.id, assigneeId: member.id, createdById: admin.id }
      ]
    });
    await prisma.activityEvent.createMany({
      data: [
        { userId: admin.id, projectId: project.id, action: "PROJECT_CREATED", detail: "created Interview Launch Plan" },
        { userId: admin.id, projectId: project.id, action: "TASK_CREATED", detail: "created dashboard and deployment tasks" }
      ]
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
