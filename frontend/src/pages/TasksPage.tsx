import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Clock3, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { authApi, projectsApi, tasksApi } from "../services/api";
import { useAuth } from "../store/auth";
import type { Project, Task, TaskStatus, User } from "../types/api";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
  due_date: z.string().optional(),
  project_id: z.coerce.number().min(1),
  assigned_to_id: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

const lanes: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export function TasksPage() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { priority: "MEDIUM", status: "TODO" } });

  const load = () => Promise.all([tasksApi.list(), projectsApi.list(), authApi.users()]).then(([taskData, projectData, userData]) => {
    setTasks(taskData.results);
    setProjects(projectData.results);
    setUsers(userData);
  });
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()) || task.project_title.toLowerCase().includes(query.toLowerCase())), [query, tasks]);

  const onSubmit = async (values: FormValues) => {
    await tasksApi.create({ ...values, due_date: values.due_date || undefined, assigned_to_id: values.assigned_to_id || null });
    toast.success("Task created");
    reset({ priority: "MEDIUM", status: "TODO", title: "", description: "", due_date: "", project_id: projects[0]?.id, assigned_to_id: undefined });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4"><input className="input" placeholder="Search tasks or projects" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      {isAdmin && (
        <form onSubmit={handleSubmit(onSubmit)} className="glass grid gap-4 rounded-2xl p-5 md:grid-cols-6">
          <input className="input md:col-span-2" placeholder="Task title" {...register("title")} />
          <select className="input" {...register("priority")}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select>
          <select className="input" {...register("status")}><option value="TODO">Todo</option><option value="IN_PROGRESS">In progress</option><option value="REVIEW">Review</option><option value="DONE">Done</option></select>
          <select className="input" {...register("project_id")}><option value="">Project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select>
          <select className="input" {...register("assigned_to_id")}><option value="">Assignee</option>{users.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}</select>
          <input type="date" className="input" {...register("due_date")} />
          <textarea className="input md:col-span-5" placeholder="Description" {...register("description")} />
          <button disabled={isSubmitting || !projects.length} className="btn-primary"><Plus size={16} /> Add</button>
        </form>
      )}
      <section className="grid gap-4 xl:grid-cols-4">
        {lanes.map((lane) => (
          <div key={lane} className="glass min-h-80 rounded-2xl p-4">
            <h2 className="mb-4 flex items-center justify-between font-bold"><span>{lane.replace("_", " ")}</span><span className="text-sm text-muted">{filtered.filter((task) => task.status === lane).length}</span></h2>
            <div className="space-y-3">
              {filtered.filter((task) => task.status === lane).map((task) => (
                <article key={task.id} className="rounded-xl border border-border bg-white/65 p-4 shadow-sm transition hover:-translate-y-1 dark:bg-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.is_overdue ? <AlertCircle className="text-danger" size={18} /> : task.status === "DONE" ? <CheckCircle2 className="text-primary" size={18} /> : <Clock3 className="text-muted" size={18} />}
                  </div>
                  <p className="mt-2 text-sm text-muted">{task.project_title}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-accent/10 px-2 py-1 font-semibold text-accent">{task.priority}</span>
                    <span className={task.is_overdue ? "font-semibold text-danger" : "text-muted"}>{task.due_date || "No date"}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
