import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatCard } from "../components/ui/StatCard";
import { Skeleton } from "../components/ui/Skeleton";
import { dashboardApi } from "../services/api";
import type { DashboardSummary } from "../types/api";

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    dashboardApi.summary().then(setData);
  }, []);

  if (!data) {
    return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Projects" value={data.total_projects} icon={FolderKanban} tone="bg-primary" />
        <StatCard label="Tasks" value={data.total_tasks} icon={ClipboardList} tone="bg-accent" />
        <StatCard label="Completed" value={data.completed_tasks} icon={CheckCircle2} tone="bg-sky-500" />
        <StatCard label="Overdue" value={data.overdue_tasks} icon={AlertTriangle} tone="bg-danger" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-2xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Project progress</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{data.completion_rate}% complete</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.project_progress}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-4 text-lg font-bold">Recent activity</h2>
          <div className="space-y-3">
            {data.recent_activity.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-white/50 p-3 dark:bg-white/5">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted">{item.project} · {item.status} · {item.assigned_to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
