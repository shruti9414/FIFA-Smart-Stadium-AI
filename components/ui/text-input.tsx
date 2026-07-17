import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "glass h-10 w-full rounded-sm px-3.5 text-sm text-text-primary placeholder:text-text-muted",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2 focus-visible:border-accent-cyan/50",
          className
        )}
        {...props}
      />
    );
  }
);
TextInput.displayName = "TextInput";
