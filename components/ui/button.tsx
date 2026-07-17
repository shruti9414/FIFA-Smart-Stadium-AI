"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** §9.7 Button — primary (gradient fill) / secondary (glass outline) / ghost / danger; sm/md/lg. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xs font-sans font-medium transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary:
          "gradient-ai-core text-void font-semibold shadow-[var(--shadow-glow-cyan)] hover:brightness-110",
        secondary:
          "glass glass-hover text-text-primary border border-border-subtle hover:text-white",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-glass",
        danger:
          "bg-state-critical text-white shadow-[var(--shadow-glow-rose)] hover:brightness-110",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-[15px]",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={16} strokeWidth={2} />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
