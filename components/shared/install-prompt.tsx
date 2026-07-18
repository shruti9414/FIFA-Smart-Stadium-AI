"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { APP_NAME } from "@/lib/constants/app";

export function InstallPrompt() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (installed || dismissed) return;
    // Show after 3 seconds (works even on localhost for testing)
    const timer = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [installed, dismissed]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 400, y: 400 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 400, y: 400 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999 }}
          className="w-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-accent-cyan/60"
        >
          {/* Main card - sleek dark with subtle glow */}
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 p-7 backdrop-blur-xl">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-blue/5 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Icon + Title */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-accent-cyan/20 flex items-center justify-center shrink-0">
                    <Download size={24} className="text-accent-cyan" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Install {APP_NAME}</h3>
                    <p className="text-sm text-gray-300 mt-1">Add to home screen for instant access during matches</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setDismissed(true);
                  }}
                  className="text-gray-500 hover:text-white transition-colors p-2 ml-2 shrink-0"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={async () => {
                    await promptInstall();
                    setOpen(false);
                  }}
                  className="flex-1 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-slate-900 px-4 py-3 text-base font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Install Now
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setDismissed(true);
                  }}
                  className="px-6 py-3 rounded-lg border-2 border-accent-cyan/40 text-accent-cyan font-semibold hover:bg-accent-cyan/10 transition-all"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
