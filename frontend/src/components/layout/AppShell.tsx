import { BarChart3, CheckSquare, FolderKanban, LayoutDashboard, LogOut, Moon, ShieldCheck, Sun, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../store/auth";
import { cn } from "../../utils/cn";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban, admin: true },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="glass fixed inset-y-4 left-4 z-20 hidden w-72 rounded-2xl p-4 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-glow">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="font-bold">TaskForge</p>
            <p className="text-xs text-muted">Team command center</p>
          </div>
        </div>
        <nav className="space-y-2">
          {nav.filter((item) => !item.admin || isAdmin).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-primary/10", isActive && "bg-primary text-white shadow-lg shadow-emerald-500/20 hover:bg-primary")
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-white/50 p-4 dark:bg-white/5">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-white">{user?.full_name.slice(0, 1)}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.full_name}</p>
              <p className="flex items-center gap-1 text-xs text-muted"><Users size={12} /> {user?.role}</p>
            </div>
          </div>
          <button className="btn-secondary w-full" onClick={logout}><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      <main className="min-h-screen flex-1 px-4 pb-24 pt-4 lg:pb-4 lg:pl-80">
        <header className="glass sticky top-4 z-10 mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{user?.role} workspace</p>
            <h1 className="text-xl font-bold">Team Task Manager</h1>
          </div>
          <button className="btn-secondary px-3" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <Outlet />
      </main>
      <nav className="glass fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-2xl p-2 lg:hidden">
        {nav.filter((item) => !item.admin || isAdmin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn("grid min-h-12 min-w-14 place-items-center rounded-xl px-2 text-xs font-semibold text-muted", isActive && "bg-primary text-white")
            }
          >
            <item.icon size={18} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
