import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckSquare, Moon, ShieldCheck, Sparkles, Sun, Users } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: ShieldCheck, title: "Role-aware control", text: "Admins manage projects and assignments while members focus on their own work." },
  { icon: BarChart3, title: "Executive dashboard", text: "Progress, overdue work, activity, and workload show up in one clean view." },
  { icon: CheckSquare, title: "Task operations", text: "Filter, prioritize, assign, and move tasks through review to completion." }
];

export function LandingPage({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-glow"><ShieldCheck size={22} /></span>
          <span>
            <span className="block font-black">TaskForge</span>
            <span className="block text-xs text-muted">Project command center</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn-secondary px-3" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="btn-secondary" to="/login">Login</Link>
          <Link className="btn-primary" to="/signup">Start <ArrowRight size={16} /></Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-sm font-semibold text-primary">
            <Sparkles size={16} /> Interview-ready full-stack SaaS
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal md:text-7xl">TaskForge</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            A polished project management app with JWT auth, admin/member permissions, team assignment, analytics, and a dashboard that makes progress obvious in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary px-5 py-3" to="/login">Try demo accounts <ArrowRight size={18} /></Link>
            <Link className="btn-secondary px-5 py-3" to="/signup">Create workspace</Link>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <p className="rounded-xl border border-border bg-card/70 p-3"><strong className="text-foreground">Admin:</strong> admin@taskmanager.dev / AdminPass123!</p>
            <p className="rounded-xl border border-border bg-card/70 p-3"><strong className="text-foreground">Member:</strong> member@taskmanager.dev / MemberPass123!</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-border bg-card/90 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-primary">Live workspace</p>
                <h2 className="text-xl font-black">Launch Sprint</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">76% complete</span>
            </div>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            {["Todo", "In Progress", "Review"].map((lane, index) => (
              <div key={lane} className="rounded-xl border border-border bg-white/65 p-3 dark:bg-white/5">
                <p className="mb-3 text-sm font-bold">{lane}</p>
                {Array.from({ length: index + 2 }).map((_, item) => (
                  <div key={item} className="mb-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                    <div className="mb-3 h-2 w-2/3 rounded-full bg-primary/70" />
                    <div className="h-2 w-full rounded-full bg-muted/30" />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-bold text-accent">HIGH</span>
                      <Users size={15} className="text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-border bg-card/70 p-5 shadow-lg shadow-slate-950/5">
            <feature.icon className="mb-4 text-primary" />
            <h3 className="font-black">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
