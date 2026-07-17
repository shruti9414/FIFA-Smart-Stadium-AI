import { cn } from "@/lib/utils/cn";

export function SuggestedPromptChip({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border border-border-subtle bg-glass px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
