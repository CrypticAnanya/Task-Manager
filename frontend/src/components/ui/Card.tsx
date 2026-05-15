import { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10", className)} {...props} />;
}
