"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { APP_NAME } from "@/lib/constants/app";

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

  const handleInstall = async () => {
    await promptInstall();
    setOpen(false);
  };

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-40 w-80 md:w-96"
        >
          <div className="relative overflow-hidden rounded-lg border border-accent-cyan/20 bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl p-4 shadow-lg shadow-accent-cyan/10">
            {/* Animated gradient border */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/10">
                <Download size={18} className="text-accent-cyan" strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary">Install {APP_NAME}</h3>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  Add to home screen for instant access — no App Store needed.
                </p>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="text-xs h-8"
                    onClick={handleInstall}
                  >
                    Install
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-8"
                    onClick={handleDismiss}
                  >
                    Later
                  </Button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 text-text-secondary hover:text-text-primary transition-colors p-0.5"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
