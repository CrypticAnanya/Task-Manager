import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../store/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass grid w-full max-w-5xl overflow-hidden rounded-2xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden min-h-[620px] bg-[linear-gradient(145deg,rgba(20,184,166,0.92),rgba(124,58,237,0.78)),url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-10 text-white md:flex md:flex-col md:justify-end">
          <p className="max-w-md text-4xl font-black leading-tight">Plan work, unblock teams, and ship with clarity.</p>
          <p className="mt-4 max-w-sm text-white/78">A recruiter-ready task management suite with real JWT auth and role-aware workflows.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10">
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-primary text-white shadow-glow"><LockKeyhole /></div>
          <h1 className="text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Use admin@taskmanager.dev / AdminPass123! after seeding, or sign up.</p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-medium">Email<input className="input mt-2" {...register("email")} /></label>
            {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
            <label className="block text-sm font-medium">Password<input type="password" className="input mt-2" {...register("password")} /></label>
            {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="btn-primary mt-8 w-full">Login <ArrowRight size={16} /></button>
          <p className="mt-6 text-center text-sm text-muted">New here? <Link className="font-semibold text-primary" to="/signup">Create an account</Link></p>
        </form>
      </motion.section>
    </main>
  );
}
