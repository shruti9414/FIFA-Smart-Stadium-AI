import { Layers } from "lucide-react";
import { APP_NAME } from "@/lib/constants/app";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-text-secondary">
          <Layers size={18} className="text-accent-cyan" strokeWidth={1.75} />
          <span className="font-display text-sm font-semibold text-text-primary">{APP_NAME}</span>
        </div>
        <p className="font-mono text-xs text-text-muted">
          Built for PromptWars Challenge 4 — Smart Stadiums &amp; Tournament Operations
        </p>
      </div>
    </footer>
  );
}
