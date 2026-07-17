"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { APP_NAME } from "@/lib/constants/app";

/**
 * Custom branded install affordance (§7) — shown as a bottom sheet a
 * short delay after the browser signals installability, rather than the
 * default browser banner, to match the command-center visual language.
 */
export function InstallPrompt() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!canInstall || installed || dismissed) return;
    const timer = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(timer);
  }, [canInstall, installed, dismissed]);

  if (!canInstall || installed) return null;

  return (
    <Sheet open={open} onClose={() => setOpen(false)} maxHeight="40vh">
      <div className="flex items-start gap-3 p-5">
        <div className="gradient-ai-core flex h-12 w-12 shrink-0 items-center justify-center rounded-sm">
          <Download size={22} className="text-void" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold text-text-primary">Install {APP_NAME}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Add it to your home screen for instant access during the match — no App Store needed.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={async () => {
                await promptInstall();
                setOpen(false);
              }}
            >
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setDismissed(true);
              }}
            >
              Not now
            </Button>
          </div>
        </div>
        <IconButton icon={X} label="Dismiss" size="sm" variant="ghost" onClick={() => setOpen(false)} />
      </div>
    </Sheet>
  );
}
