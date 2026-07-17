"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const NODES = [
  { x: 18, y: 28 }, { x: 42, y: 14 }, { x: 68, y: 22 }, { x: 84, y: 40 },
  { x: 12, y: 58 }, { x: 38, y: 68 }, { x: 62, y: 74 }, { x: 88, y: 62 },
  { x: 50, y: 44 },
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7], [3, 7],
  [1, 8], [4, 8], [6, 8], [2, 8],
];

/**
 * The full layered hero atmosphere (§ landing redesign): gradient mesh,
 * noise, holographic stadium rings (CSS 3D perspective, two speeds),
 * floodlight beams, fog, scanline sweep, and a pulsing neural network —
 * composited as depth layers that respond to mouse parallax at
 * different intensities per layer (background moves least, foreground
 * most). Pure CSS/SVG/Framer Motion — no 3D engine, kept intentionally
 * light so it stays smooth on a projector laptop.
 */
export function HeroAtmosphere({ parallaxX, parallaxY }: { parallaxX: MotionValue<number>; parallaxY: MotionValue<number> }) {
  const reduced = useReducedMotion();

  const ringsX = useTransform(parallaxX, (v) => v * 8);
  const ringsY = useTransform(parallaxY, (v) => v * 8);
  const hudX = useTransform(parallaxX, (v) => v * 22);
  const hudY = useTransform(parallaxY, (v) => v * 22);
  const netX = useTransform(parallaxX, (v) => v * -14);
  const netY = useTransform(parallaxY, (v) => v * -14);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Layer 0 — gradient mesh base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(ellipse_at_75%_75%,rgba(16,185,129,0.09),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.08),transparent_60%)]" />

      {/* Layer 1 — fog blobs, slow independent drift */}
      <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-accent-cyan/10 blur-[120px] animate-drift-slow" />
      <div className="absolute -bottom-32 -right-32 h-[560px] w-[560px] rounded-full bg-accent-emerald/10 blur-[120px] animate-drift-slower" />
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/8 blur-[100px] animate-drift-slow" />

      {/* Layer 2 — floodlight beams */}
      <div
        className="absolute left-1/2 top-0 h-[900px] w-[240px] -translate-x-1/2 origin-top animate-beam-sweep"
        style={{ background: "linear-gradient(to bottom, rgba(34,211,238,0.18), transparent 70%)", filter: "blur(30px)" }}
      />
      <div
        className="absolute left-[30%] top-0 h-[700px] w-[160px] origin-top animate-beam-sweep"
        style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.12), transparent 70%)", filter: "blur(30px)", animationDelay: "-3s" }}
      />
      <div
        className="absolute left-[68%] top-0 h-[700px] w-[160px] origin-top animate-beam-sweep"
        style={{ background: "linear-gradient(to bottom, rgba(59,130,246,0.14), transparent 70%)", filter: "blur(30px)", animationDelay: "-6s" }}
      />

      {/* Layer 3 — holographic stadium rings, isometric CSS 3D perspective */}
      <motion.div
        style={reduced ? undefined : { x: ringsX, y: ringsY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div style={{ perspective: "1200px" }}>
          <div
            className="relative h-[820px] w-[820px] opacity-[0.16]"
            style={{ transform: "rotateX(58deg) rotateZ(0deg)", transformStyle: "preserve-3d" }}
          >
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-ring-spin-slow">
              <ellipse cx="200" cy="200" rx="190" ry="190" fill="none" stroke="url(#ringGradA)" strokeWidth="1.5" strokeDasharray="4 10" />
            </svg>
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-ring-spin-reverse">
              <ellipse cx="200" cy="200" rx="150" ry="150" fill="none" stroke="url(#ringGradB)" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-ring-spin-slow">
              <ellipse cx="200" cy="200" rx="110" ry="110" fill="none" stroke="url(#ringGradA)" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="ringGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="ringGradB" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Layer 4 — neural network, drifts opposite the rings for parallax depth */}
      <motion.svg
        style={reduced ? undefined : { x: netX, y: netY }}
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full opacity-[0.22]"
        preserveAspectRatio="xMidYMid slice"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
            stroke="#22D3EE" strokeWidth="0.15" strokeDasharray="1.2 1.6"
            className="animate-scan"
            style={{ animationDuration: `${4 + (i % 4)}s`, animationDirection: "alternate", animationTimingFunction: "ease-in-out" }}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x} cy={n.y} r="1.1"
            fill={i % 3 === 0 ? "#22D3EE" : i % 3 === 1 ? "#3B82F6" : "#10B981"}
            className="animate-node-pulse"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}
      </motion.svg>

      {/* Layer 5 — floating HUD-style ambient particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent-cyan/60 animate-float"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            opacity: 0.4,
            animationDelay: `${(i % 7) * 0.6}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}

      {/* Layer 6 — scanline sweep + static scanline texture */}
      <div className="scanlines absolute inset-0 opacity-[0.03]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-cyan/[0.06] to-transparent animate-scan" />

      {/* Layer 7 — floating holographic HUD widgets, foreground parallax */}
      <motion.div style={reduced ? undefined : { x: hudX, y: hudY }} className="contents">
        <HudChip className="left-[8%] top-[22%] animate-float" label="GATE 4" value="91%" tone="critical" delay="0s" />
        <HudChip className="right-[10%] top-[30%] animate-float-delayed" label="AI CONFIDENCE" value="94%" tone="success" delay="0.3s" />
        <HudChip className="left-[14%] bottom-[20%] animate-float-delayed" label="RECOMMENDATIONS" value="3 ACTIVE" tone="info" delay="0.6s" />
        <HudChip className="right-[6%] bottom-[26%] animate-float" label="FANS TRACKED" value="14,382" tone="info" delay="0.9s" />
      </motion.div>

      <div className="noise-overlay" />
    </div>
  );
}

function HudChip({ className, label, value, tone, delay }: { className: string; label: string; value: string; tone: "critical" | "success" | "info"; delay: string }) {
  const toneColor = tone === "critical" ? "text-state-critical" : tone === "success" ? "text-state-success" : "text-accent-cyan";
  return (
    <div
      className={`glass absolute hidden rounded-sm px-3 py-2 md:block ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="font-mono text-[9px] uppercase tracking-widest text-text-muted">{label}</div>
      <div className={`font-mono text-sm font-semibold ${toneColor}`}>{value}</div>
    </div>
  );
}
