import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100">
        <Icon className="size-6 text-slate-500" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 text-lg font-bold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
