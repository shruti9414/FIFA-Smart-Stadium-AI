import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SectionShellProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  alt?: boolean;
}

/** Consistent full-width section rhythm for the desktop long-scroll Fan Experience — Apple-product-page cadence: generous vertical padding, dramatic heading scale, content capped at a wide reading width. */
export function SectionShell({ id, title, subtitle, icon: Icon, children, className, alt = false }: SectionShellProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 px-4 py-16 sm:px-6 lg:px-10 lg:py-24", alt && "bg-white/[0.02]", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-3 lg:mb-14">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-cyan/10">
              <Icon size={22} className="text-accent-cyan" strokeWidth={1.75} />
            </div>
          )}
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-text-secondary sm:text-base">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
