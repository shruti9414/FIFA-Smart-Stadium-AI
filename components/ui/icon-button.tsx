"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/icon";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-xs transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        ghost: "text-text-secondary hover:text-text-primary hover:bg-glass",
        glass: "glass glass-hover text-text-primary",
        solid: "gradient-ai-core text-void",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant, size, className, ...props }, ref) => {
    const iconPx = size === "lg" ? 22 : size === "sm" ? 16 : 20;
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Icon icon={icon} size={iconPx} />
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
