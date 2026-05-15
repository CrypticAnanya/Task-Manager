import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { dashboardApi } from "../services/api";
import type { DashboardSummary } from "../types/api";

const colors = ["#14b8a6", "#8b5cf6", "#0ea5e9", "#ef4444"];

export function AnalyticsPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  useEffect(() => { dashboardApi.summary().then(setData); }, []);

  const statusData = data ? Object.entries(data.status_counts).map(([name, value]) => ({ name, value })) : [];
  const priorityData = data ? Object.entries(data.priority_counts).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[{ title: "Status mix", data: statusData }, { title: "Priority mix", data: priorityData }].map((chart) => (
        <section key={chart.title} className="glass rounded-2xl p-5">
          <h2 className="mb-4 text-lg font-bold">{chart.title}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chart.data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={110} paddingAngle={4}>
                  {chart.data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      ))}
    </div>
  );
}
