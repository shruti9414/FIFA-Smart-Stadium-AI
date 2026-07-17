"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { densityToColor } from "@/lib/utils/heatmap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import type { StadiumGate, StadiumSection, CrowdDataRow } from "@/lib/types/db";

const ZONE_ANGLE: Record<string, number> = { North: 0, East: 90, South: 180, West: 270 };
const RING_RADIUS: Record<string, { inner: number; outer: number }> = {
  Lower: { inner: 62, outer: 116 },
  Club: { inner: 122, outer: 150 },
  Upper: { inner: 122, outer: 172 },
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function annularSectorPath(cx: number, cy: number, rOuter: number, rInner: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rOuter, a0);
  const p2 = polar(cx, cy, rOuter, a1);
  const p3 = polar(cx, cy, rInner, a1);
  const p4 = polar(cx, cy, rInner, a0);
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

const GATE_GLYPH_COLOR: Record<string, string> = {
  open: "var(--color-state-success)",
  congested: "var(--color-state-warning)",
  closed: "var(--color-state-critical)",
};

interface DigitalTwinCanvasProps {
  gates: StadiumGate[];
  sections: StadiumSection[];
  crowd: CrowdDataRow[];
  size?: number;
  interactive?: boolean;
  selectedSectionId?: number | null;
  onSelectSection?: (sectionId: number) => void;
  className?: string;
}

export function DigitalTwinCanvas({
  gates,
  sections,
  crowd,
  size = 420,
  interactive = true,
  selectedSectionId = null,
  onSelectSection,
  className,
}: DigitalTwinCanvasProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 420;

  const densityBySection = useMemo(() => {
    const map = new Map<number, { density: number; trend: string }>();
    for (const c of crowd) {
      if (c.location_type === "section") map.set(c.location_id, { density: Number(c.density_pct), trend: c.trend });
    }
    return map;
  }, [crowd]);

  const zones = useMemo(() => {
    return sections
      .map((section) => {
        const gate = gates.find((g) => g.section_id === section.id);
        const angleCenter = ZONE_ANGLE[section.zone] ?? 0;
        const ring = RING_RADIUS[section.tier ?? "Lower"] ?? RING_RADIUS.Lower;
        const span = 82;
        const a0 = angleCenter - span / 2;
        const a1 = angleCenter + span / 2;
        const density = densityBySection.get(section.id)?.density ?? 20;
        return { section, gate, a0, a1, ring, density, angleCenter };
      })
      .filter((z) => z.gate);
  }, [sections, gates, densityBySection]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Interactive stadium digital twin — live crowd density by section"
    >
      {/* pitch */}
      <ellipse cx={cx} cy={cy} rx={54 * scale} ry={40 * scale} fill="#064e3b" stroke="rgba(16,185,129,0.4)" strokeWidth={1.5} />
      <line x1={cx} y1={cy - 40 * scale} x2={cx} y2={cy + 40 * scale} stroke="rgba(16,185,129,0.35)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={14 * scale} fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth={1} />

      {zones.map(({ section, gate, a0, a1, ring, density, angleCenter }) => {
        if (!gate) return null;
        const isSelected = selectedSectionId === section.id;
        const isHovered = hovered === section.id;
        const color = densityToColor(density);
        const gatePos = polar(cx, cy, ring.outer * scale + 14 * scale, angleCenter);

        return (
          <g key={section.id}>
            <Tooltip
              content={
                <div className="text-left">
                  <div className="font-semibold text-text-primary">{section.name}</div>
                  <div className="font-mono text-[11px] text-text-secondary">
                    {Math.round(density)}% · {gate.name} ({gate.status})
                  </div>
                </div>
              }
            >
              <motion.path
                d={annularSectorPath(cx, cy, ring.outer * scale, ring.inner * scale, a0, a1)}
                fill={color}
                fillOpacity={isSelected ? 0.85 : isHovered ? 0.75 : 0.55}
                stroke={isSelected ? "#22D3EE" : "rgba(255,255,255,0.15)"}
                strokeWidth={isSelected ? 2.5 : 1}
                style={{ cursor: interactive ? "pointer" : "default" }}
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: density >= 40 ? [1, 1 + 0.02 * Math.min((density - 40) / 60, 1), 1] : 1,
                      }
                }
                transition={{ duration: 3.6 - 1.6 * Math.min(Math.max(density - 40, 0) / 60, 1), repeat: Infinity, ease: "easeInOut" }}
                onClick={() => interactive && onSelectSection?.(section.id)}
                onMouseEnter={() => setHovered(section.id)}
                onMouseLeave={() => setHovered(null)}
              />
            </Tooltip>
            <circle
              cx={gatePos.x}
              cy={gatePos.y}
              r={6 * scale}
              fill={gate.status === "open" ? "none" : GATE_GLYPH_COLOR[gate.status]}
              stroke={GATE_GLYPH_COLOR[gate.status]}
              strokeWidth={2}
              className={gate.status === "congested" ? "animate-pulse-glow" : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}
