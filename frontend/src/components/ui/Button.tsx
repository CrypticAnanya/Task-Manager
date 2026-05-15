import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => {
  const variants: Record<Variant, string> = {
    primary: "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-ink",
    secondary: "border border-slate-200 bg-white/70 text-ink hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
    danger: "bg-coral text-white shadow-soft hover:-translate-y-0.5",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";
