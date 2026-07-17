"use client";

import { motion } from "framer-motion";
import { QrPattern } from "@/components/fan/qr-pattern";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TicketInfo {
  section: string;
  row: string;
  seat: string;
  gate: string;
  holder: string;
}

/** Premium digital ticket — the "boarding pass" moment. Perforated divider, QR, gradient edge glow. */
export function TicketCard({ ticket }: { ticket: TicketInfo }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.15 }}
      className="gradient-border relative flex overflow-hidden rounded-lg"
    >
      <div className="flex-1 p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-cyan">Digital Ticket</span>
          <span className="rounded-full bg-state-success/15 px-2 py-0.5 font-mono text-[10px] text-state-success">Valid</span>
        </div>
        <p className="text-sm text-text-secondary">{ticket.holder}</p>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase text-text-muted">Section</div>
            <div className="font-display text-lg font-bold text-text-primary">{ticket.section}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-text-muted">Row</div>
            <div className="font-display text-lg font-bold text-text-primary">{ticket.row}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-text-muted">Seat</div>
            <div className="font-display text-lg font-bold text-text-primary">{ticket.seat}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-accent-cyan">Entry via {ticket.gate}</div>
      </div>

      <div className="relative flex w-28 shrink-0 flex-col items-center justify-center gap-2 border-l border-dashed border-border-emphasis bg-glass-elevated p-3">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-0 h-2 w-2 -translate-x-1/2 rounded-full bg-void"
            style={{ top: `${(i / 13) * 100}%` }}
          />
        ))}
        <QrPattern seed={`${ticket.section}-${ticket.seat}`} size={80} />
      </div>
    </motion.div>
  );
}
