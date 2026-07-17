"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { densityToTrafficColor } from "@/lib/utils/heatmap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { StadiumGate, StadiumSection, CrowdDataRow } from "@/lib/types/db";

const ZONE_ANGLE: Record<string, number> = { North: 0, East: 90, South: 180, West: 270 };
const RING_RADIUS: Record<string, { inner: number; outer: number }> = {
  Lower: { inner: 70, outer: 130 },
  Club: { inner: 138, outer: 168 },
  Upper: { inner: 138, outer: 190 },
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

export interface StadiumNavigatorProps {
  gates: StadiumGate[];
  sections: StadiumSection[];
  crowd: CrowdDataRow[];
  userSectionName: string;
  selectedGateId: number | null;
  onSelectGate: (gate: StadiumGate, section: StadiumSection) => void;
  routeActive: boolean;
}

/** Interactive circular stadium map — tap a zone to select it as a destination, drag to rotate, scroll/pinch to zoom. */
export function StadiumNavigator({ gates, sections, crowd, userSectionName, selectedGateId, onSelectGate, routeActive }: StadiumNavigatorProps) {
  const reduced = useReducedMotion();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const dragState = useRef<{ startAngle: number; startRotation: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;

  const densityBySection = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of crowd) if (c.location_type === "section") map.set(c.location_id, Number(c.density_pct));
    return map;
  }, [crowd]);

  const zones = useMemo(
    () =>
      sections
        .map((section) => {
          const gate = gates.find((g) => g.section_id === section.id);
          const angleCenter = ZONE_ANGLE[section.zone] ?? 0;
          const ring = RING_RADIUS[section.tier ?? "Lower"] ?? RING_RADIUS.Lower;
          const span = 82;
          return { section, gate, a0: angleCenter - span / 2, a1: angleCenter + span / 2, ring, angleCenter, density: densityBySection.get(section.id) ?? 20 };
        })
        .filter((z) => z.gate),
    [sections, gates, densityBySection]
  );

  const userZone = zones.find((z) => z.section.name.includes(userSectionName));
  const selectedZone = zones.find((z) => z.gate?.id === selectedGateId);

  const angleFromCenter = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startAngle: angleFromCenter(e.clientX, e.clientY), startRotation: rotation };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const current = angleFromCenter(e.clientX, e.clientY);
    setRotation(dragState.current.startRotation + (current - dragState.current.startAngle));
  };
  const onPointerUp = () => {
    dragState.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(1.8, Math.max(0.7, z - e.deltaY * 0.001)));
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
        <IconButton icon={ZoomIn} label="Zoom in" size="sm" variant="glass" onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))} />
        <IconButton icon={ZoomOut} label="Zoom out" size="sm" variant="glass" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} />
        <IconButton icon={RotateCcw} label="Reset view" size="sm" variant="glass" onClick={() => { setZoom(1); setRotation(0); }} />
      </div>

      <div className="mx-auto flex aspect-square w-full max-w-[720px] items-center justify-center overflow-hidden rounded-lg" style={{ perspective: "1400px" }}>
        <motion.svg
          ref={svgRef}
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full touch-none select-none"
          style={{ cursor: "grab", transformStyle: "preserve-3d" }}
          animate={{ scale: zoom, rotate: rotation, rotateX: reduced ? 0 : 32 }}
          transition={{ type: reduced ? "tween" : "spring", stiffness: 120, damping: 20, duration: reduced ? 0 : undefined }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
        >
          {/* floodlight towers at the four corners */}
          {[45, 135, 225, 315].map((angle) => {
            const pos = polar(cx, cy, 215, angle);
            return (
              <g key={angle}>
                <circle cx={pos.x} cy={pos.y} r={3} fill="#22D3EE" opacity={0.5} className="animate-pulse-glow" />
                <line x1={pos.x} y1={pos.y} x2={cx + (pos.x - cx) * 0.85} y2={cy + (pos.y - cy) * 0.85} stroke="#22D3EE" strokeWidth={0.5} opacity={0.15} />
              </g>
            );
          })}

          <ellipse cx={cx} cy={cy} rx={58} ry={42} fill="#064e3b" stroke="rgba(16,185,129,0.4)" strokeWidth={1.5} />
          <line x1={cx} y1={cy - 42} x2={cx} y2={cy + 42} stroke="rgba(16,185,129,0.35)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={15} fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth={1} />
          {/* goal posts */}
          <rect x={cx - 8} y={cy - 43} width={16} height={3} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
          <rect x={cx - 8} y={cy + 40} width={16} height={3} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />

          {/* crowd dots — density proportional, within each zone */}
          {zones.map((z) =>
            z.gate
              ? Array.from({ length: Math.round((z.density / 100) * 10) }).map((_, i) => {
                  const a = z.a0 + ((z.a1 - z.a0) * (i + 1)) / 12;
                  const r = z.ring.inner + ((z.ring.outer - z.ring.inner) * ((i % 3) + 1)) / 4;
                  const pos = polar(cx, cy, r, a);
                  return <circle key={`crowd-${z.section.id}-${i}`} cx={pos.x} cy={pos.y} r={1.1} fill="rgba(255,255,255,0.5)" />;
                })
              : null
          )}

          {zones.map((z) => {
            if (!z.gate) return null;
            const isSelected = z.gate.id === selectedGateId;
            const isHovered = hovered === z.section.id;
            const color = densityToTrafficColor(z.density);
            return (
              <path
                key={z.section.id}
                d={annularSectorPath(cx, cy, z.ring.outer, z.ring.inner, z.a0, z.a1)}
                fill={color}
                fillOpacity={isSelected ? 0.9 : isHovered ? 0.75 : 0.5}
                stroke={isSelected ? "#22D3EE" : "rgba(255,255,255,0.15)"}
                strokeWidth={isSelected ? 2.5 : 1}
                style={{ cursor: "pointer" }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => z.gate && onSelectGate(z.gate, z.section)}
                onMouseEnter={() => setHovered(z.section.id)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* gate glyphs */}
          {zones.map((z) => {
            if (!z.gate) return null;
            const pos = polar(cx, cy, z.ring.outer + 12, z.angleCenter);
            return (
              <text key={`g-${z.gate.id}`} x={pos.x} y={pos.y} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace" style={{ pointerEvents: "none" }}>
                {z.gate.name.replace("Gate ", "G")}
              </text>
            );
          })}

          {/* animated path from user to selected destination */}
          {routeActive && userZone && selectedZone && (
            <motion.path
              d={`M ${polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).x} ${polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).y}
                  A ${(userZone.ring.inner + userZone.ring.outer) / 2 + 20} ${(userZone.ring.inner + userZone.ring.outer) / 2 + 20} 0 0 1
                  ${polar(cx, cy, (selectedZone.ring.inner + selectedZone.ring.outer) / 2, selectedZone.angleCenter).x} ${polar(cx, cy, (selectedZone.ring.inner + selectedZone.ring.outer) / 2, selectedZone.angleCenter).y}`}
              fill="none"
              stroke="#22D3EE"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -24] }}
              transition={{ pathLength: { duration: reduced ? 0 : 0.8 }, opacity: { duration: 0.3 }, strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" } }}
            />
          )}

          {/* user location pulse */}
          {userZone && (
            <g>
              <circle
                cx={polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).x}
                cy={polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).y}
                r={7}
                fill="#22D3EE"
                className="animate-pulse-glow"
              />
              <circle
                cx={polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).x}
                cy={polar(cx, cy, (userZone.ring.inner + userZone.ring.outer) / 2, userZone.angleCenter).y}
                r={3}
                fill="white"
              />
            </g>
          )}
        </motion.svg>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 font-mono text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[rgb(16,185,129)]" />Clear</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[rgb(234,179,8)]" />Busy</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[rgb(244,63,94)]" />Congested</span>
      </div>
    </div>
  );
}
