"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { StadiumSection, StadiumGate } from "@/lib/types/db";

interface Props {
  sections: StadiumSection[];
  gates: StadiumGate[];
  crowd: Array<{ location_type: string; location_id: number; density_pct: number }>;
  selectedId: number | null;
  onSelect: (id: number) => void;
  incidents: Array<{ location_id?: number }>;
}

export function Stadium3DTwin({ sections, gates, crowd, selectedId, onSelect, incidents }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getZoneDensity = (sectionId: number) => {
    return crowd.find(c => c.location_type === "section" && c.location_id === sectionId)?.density_pct ?? 0;
  };

  const hasIncident = (sectionId: number) => {
    return incidents.some(i => i.location_id === sectionId);
  };

  const getDensityColor = (density: number) => {
    if (density > 90) return "from-state-critical to-orange-600";
    if (density > 70) return "from-state-warning to-yellow-600";
    if (density > 50) return "from-blue-500 to-blue-600";
    return "from-state-success to-emerald-600";
  };

  const getDensityBorder = (density: number) => {
    if (density > 90) return "border-state-critical shadow-[0_0_20px_rgba(244,63,94,0.6)]";
    if (density > 70) return "border-state-warning shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    if (density > 50) return "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
    return "border-state-success shadow-[0_0_10px_rgba(16,185,129,0.3)]";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-void via-surface to-void/50 p-8">
      {/* 3D Isometric Stadium Grid */}
      <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
        {/* Isometric Grid Background */}
        <defs>
          <pattern id="iso-grid" x="100" y="86.6" width="200" height="173.2" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 200 86.6 L 100 173.2 L 0 86.6 Z" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="1" />
          </pattern>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid Background */}
        <rect width="1000" height="800" fill="url(#iso-grid)" />

        {/* Stadium Sections - Isometric Layout */}
        {sections.map((section, idx) => {
          const isSelected = selectedId === section.id;
          const isHovered = hoveredId === section.id;
          const density = getZoneDensity(section.id);
          const incident = hasIncident(section.id);

          // Position sections in isometric grid
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          const x = 150 + col * 200;
          const y = 150 + row * 173.2;

          return (
            <g key={section.id} className="cursor-pointer">
              {/* Zone Diamond - Isometric */}
              <motion.polygon
                points={`${x},${y - 70} ${x + 100},${y} ${x},${y + 70} ${x - 100},${y}`}
                fill={incident ? "rgba(244,63,94,0.3)" : isSelected ? "rgba(34,211,238,0.4)" : isHovered ? "rgba(59,130,246,0.3)" : "rgba(107,114,128,0.2)"}
                stroke={incident ? "#f43f5e" : isSelected ? "#22d3ee" : isHovered ? "#3b82f6" : "#6b7280"}
                strokeWidth={isSelected || incident ? 3 : 2}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect(section.id)}
                style={{
                  filter: incident ? "drop-shadow(0 0 20px rgba(244,63,94,0.8))" : isSelected ? "drop-shadow(0 0 15px rgba(34,211,238,0.6))" : undefined,
                  transition: "all 200ms ease",
                }}
              />

              {/* Density Bar Inside Zone */}
              <g>
                {/* Background */}
                <rect x={x - 60} y={y - 10} width="120" height="8" rx="2" fill="rgba(0,0,0,0.4)" />
                {/* Density Fill */}
                <motion.rect
                  x={x - 60}
                  y={y - 10}
                  width={120 * (density / 100)}
                  height="8"
                  rx="2"
                  fill={incident ? "#f43f5e" : density > 80 ? "#fb923c" : density > 60 ? "#fbbf24" : density > 40 ? "#3b82f6" : "#10b981"}
                  animate={{ width: 120 * (density / 100) }}
                  transition={{ duration: 0.5 }}
                />
              </g>

              {/* Zone Label */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="text-xs font-bold fill-white pointer-events-none"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                {section.name.slice(0, 4)}
              </text>

              {/* Density Percentage */}
              <text
                x={x}
                y={y - 25}
                textAnchor="middle"
                className="text-sm font-bold fill-accent-cyan pointer-events-none"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}
              >
                {Math.round(density)}%
              </text>

              {/* Incident Alert Pulse */}
              {incident && (
                <>
                  <motion.circle
                    cx={x + 80}
                    cy={y - 60}
                    r="8"
                    fill="#f43f5e"
                    animate={{ r: [8, 12, 8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <circle cx={x + 80} cy={y - 60} r="8" fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.5" />
                </>
              )}
            </g>
          );
        })}

        {/* Gates - Animated */}
        {gates.map((gate, idx) => {
          const x = 100 + (idx % 6) * 150;
          const y = 700 + Math.floor(idx / 6) * 40;
          const isOpen = gate.status === "open";
          const isCongested = gate.status === "congested";

          return (
            <g key={gate.id}>
              <motion.rect
                x={x}
                y={y}
                width="120"
                height="30"
                rx="4"
                fill={isCongested ? "rgba(251,191,36,0.3)" : isOpen ? "rgba(16,185,129,0.3)" : "rgba(148,163,184,0.3)"}
                stroke={isCongested ? "#fbbf24" : isOpen ? "#10b981" : "#94a3b8"}
                strokeWidth="2"
                animate={{
                  fill: isCongested ? "rgba(251,191,36,0.5)" : isOpen ? "rgba(16,185,129,0.3)" : "rgba(148,163,184,0.2)",
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <text x={x + 60} y={y + 20} textAnchor="middle" className="text-xs font-bold fill-white">
                {gate.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md border border-border-subtle rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-state-success" /> Low Density
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Moderate
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-state-warning" /> High
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-state-critical" /> Critical
        </div>
      </div>
    </div>
  );
}
