import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        className={cn(
          "glass h-9 w-full rounded-sm pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2",
          className
        )}
        {...props}
      />
    </div>
  );
}
