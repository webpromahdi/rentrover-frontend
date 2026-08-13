import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border bg-input/30 text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Exact Color Overrides for Status & Conditions
        colorAmber: "bg-amber-100 text-amber-700",
        colorBlue: "bg-blue-100 text-blue-700",
        colorPurple: "bg-purple-100 text-purple-700",
        colorGreen: "bg-green-100 text-green-700",
        colorEmerald: "bg-emerald-100 text-emerald-700",
        colorSlate600: "bg-slate-100 text-slate-600",
        colorSlate700: "bg-slate-100 text-slate-700",
        colorRed: "bg-primary/20 text-red-700",
        colorOrange: "bg-orange-100 text-orange-700",
        colorSlate500: "bg-slate-100 text-slate-500",

        // User Status
        statusActive: "bg-emerald-50 text-emerald-600",
        statusInactive: "bg-primary/10 text-red-600",

        // Specific Roles & Scoped Variables
        roleCustomer: "bg-blue-50 text-blue-600",
        roleProvider: "bg-amber-50 text-amber-600",
        roleAdmin: "bg-slate-100 text-slate-700",
        condition: "bg-condition text-condition-foreground",
      },
      size: {
        default: "h-5 rounded-md px-2 py-0.5 text-xs font-medium",
        
        // Status Sizing Variants
        status: "rounded-md px-2 py-0.5 text-xs font-semibold",
        statusSm: "rounded-sm px-1.5 py-0.5 text-[10px] font-semibold",
        statusLg: "rounded-md px-2.5 py-1 text-sm font-semibold",
        
        // Role & Condition Sizing Variants
        role: "rounded-md px-2 py-0.5 text-[10px] font-semibold",
        condition: "rounded-md px-2 py-0.5 text-[10px] font-semibold",
        conditionCard: "rounded-md px-2 py-0.5 text-[10px] font-semibold",
        
        // Category / Info Sizing Variants
        category: "rounded-md px-2 py-0.5 text-[10px] font-semibold",
        categoryLg: "rounded-md px-2.5 py-1 text-xs font-semibold",
        info: "rounded-md px-2.5 py-1 text-xs font-semibold",
        infoLg: "rounded-md px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
