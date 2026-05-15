import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { projectsApi } from "../services/api";
import type { Project } from "../types/api";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const load = () => projectsApi.list().then((data) => setProjects(data.results));
  useEffect(() => { load(); }, []);

  const onSubmit = async (values: FormValues) => {
    await projectsApi.create({ ...values, due_date: values.due_date || undefined });
    toast.success("Project created");
    reset();
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-5">
        <h2 className="mb-5 text-lg font-bold">Create project</h2>
        <div className="space-y-4">
          <label className="block text-sm font-medium">Title<input className="input mt-2" {...register("title")} /></label>
          <label className="block text-sm font-medium">Description<textarea rows={4} className="input mt-2 resize-none" {...register("description")} /></label>
          <label className="block text-sm font-medium">Due date<input type="date" className="input mt-2" {...register("due_date")} /></label>
        </div>
        <button disabled={isSubmitting} className="btn-primary mt-5 w-full"><Plus size={16} /> Create</button>
      </form>
      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="glass rounded-2xl p-5 transition hover:-translate-y-1">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{project.description || "No description yet"}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{project.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full bg-primary" style={{ width: `${project.progress}%` }} /></div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>{project.task_count} tasks</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {project.due_date || "No due date"}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
