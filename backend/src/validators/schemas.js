import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2).optional(),
  full_name: z.string().min(2).optional(),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
  confirm_password: z.string().optional(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER")
}).refine((data) => !data.confirm_password || data.password === data.confirm_password, {
  path: ["confirm_password"],
  message: "Passwords do not match"
}).transform((data) => ({ ...data, fullName: data.fullName ?? data.full_name }));

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"]).default("ACTIVE"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  memberIds: z.array(z.coerce.number()).optional(),
  member_ids: z.array(z.coerce.number()).optional()
}).transform((data) => ({
  ...data,
  deadline: data.deadline ?? data.due_date,
  memberIds: data.memberIds ?? data.member_ids ?? []
}));

export const projectUpdateSchema = projectSchema.partial();

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  projectId: z.coerce.number().optional(),
  project_id: z.coerce.number().optional(),
  assigneeId: z.coerce.number().optional().nullable(),
  assigned_to_id: z.coerce.number().optional().nullable()
}).transform((data) => ({
  ...data,
  dueDate: data.dueDate ?? data.due_date,
  projectId: data.projectId ?? data.project_id,
  assigneeId: data.assigneeId ?? data.assigned_to_id ?? null
})).refine((data) => data.projectId, { path: ["projectId"], message: "Project is required" });

export const taskUpdateSchema = taskSchema.partial();
