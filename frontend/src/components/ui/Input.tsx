import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "../../utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-lg border border-slate-200 bg-white/75 px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/10 dark:text-white",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
