import { Layers } from "lucide-react";
import { APP_NAME } from "@/lib/constants/app";

export function FanFooter() {
  return (
    <footer className="border-t border-border-subtle px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-text-secondary">
          <Layers size={16} className="text-accent-cyan" strokeWidth={1.75} />
          <span className="font-display text-sm font-semibold text-text-primary">{APP_NAME}</span>
        </div>
        <p className="font-mono text-[11px] text-text-muted">Enjoy the match. Stay safe. Tap the AI Assistant anytime.</p>
      </div>
    </footer>
  );
}
