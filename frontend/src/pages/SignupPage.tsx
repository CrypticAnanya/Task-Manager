import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../store/auth";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  role: z.enum(["ADMIN", "MEMBER"]),
}).refine((data) => data.password === data.confirm_password, { message: "Passwords do not match", path: ["confirm_password"] });

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "MEMBER" },
  });
  const selectedRole = watch("role");

  const onSubmit = async (values: FormValues) => {
    try {
      console.debug("signup form selected role", values.role);
      await registerAccount(values);
      navigate("/dashboard");
    } catch {
      toast.error("Could not create account");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="glass w-full max-w-2xl rounded-2xl p-8 md:p-10">
        <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-accent text-white"><ShieldCheck /></div>
        <h1 className="text-3xl font-black">Create your workspace</h1>
        <p className="mt-2 text-sm text-muted">The selected role is sent to the API and returned in the JWT-backed auth state.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium md:col-span-2">Full name<input className="input mt-2" {...register("full_name")} /></label>
          <label className="block text-sm font-medium">Email<input className="input mt-2" {...register("email")} /></label>
          <label className="block text-sm font-medium">Role<select className="input mt-2" {...register("role")}><option value="MEMBER">Member</option><option value="ADMIN">Admin</option></select></label>
          <label className="block text-sm font-medium">Password<input type="password" className="input mt-2" {...register("password")} /></label>
          <label className="block text-sm font-medium">Confirm password<input type="password" className="input mt-2" {...register("confirm_password")} /></label>
        </div>
        <div className="mt-4 space-y-1 text-sm text-danger">{Object.values(errors).map((error) => <p key={error.message}>{error.message}</p>)}</div>
        <div className="mt-5 rounded-xl border border-border bg-primary/10 p-4 text-sm">Selected role: <strong>{selectedRole}</strong></div>
        <button disabled={isSubmitting} className="btn-primary mt-6 w-full">Sign up <ArrowRight size={16} /></button>
        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-primary" to="/login">Login</Link></p>
      </motion.form>
    </main>
  );
}
