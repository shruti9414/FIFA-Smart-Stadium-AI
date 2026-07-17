/**
 * §9.1 density heatmap interpolation: calm (#0EA5E9, 0-40%) -> amber
 * (#FBBF24, 40-70%) -> rose (#F43F5E, 70-100%). Used by DigitalTwinCanvas,
 * HeatmapZone, and the landing page's mini preview so every density
 * visualization in the product reads from the same scale.
 */
const STOPS: { at: number; color: [number, number, number] }[] = [
  { at: 0, color: [14, 165, 233] }, // #0EA5E9
  { at: 40, color: [14, 165, 233] },
  { at: 70, color: [251, 191, 36] }, // #FBBF24
  { at: 100, color: [244, 63, 94] }, // #F43F5E
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function densityToColor(densityPct: number): string {
  const pct = Math.min(100, Math.max(0, densityPct));
  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (pct >= STOPS[i].at && pct <= STOPS[i + 1].at) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }
  const range = upper.at - lower.at || 1;
  const t = (pct - lower.at) / range;
  const [r, g, b] = lower.color.map((c, i) => Math.round(lerp(c, upper.color[i], t)));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Green/yellow/red traffic-light scale — used specifically by the Fan Navigate stadium map (a distinct visual language from the calm/amber/rose Ops heatmap, matching how a fan reads "which way is clear"). */
const TRAFFIC_STOPS: { at: number; color: [number, number, number] }[] = [
  { at: 0, color: [16, 185, 129] }, // emerald
  { at: 45, color: [16, 185, 129] },
  { at: 70, color: [234, 179, 8] }, // amber/yellow
  { at: 100, color: [244, 63, 94] }, // rose/red
];

export function densityToTrafficColor(densityPct: number): string {
  const pct = Math.min(100, Math.max(0, densityPct));
  let lower = TRAFFIC_STOPS[0];
  let upper = TRAFFIC_STOPS[TRAFFIC_STOPS.length - 1];
  for (let i = 0; i < TRAFFIC_STOPS.length - 1; i++) {
    if (pct >= TRAFFIC_STOPS[i].at && pct <= TRAFFIC_STOPS[i + 1].at) {
      lower = TRAFFIC_STOPS[i];
      upper = TRAFFIC_STOPS[i + 1];
      break;
    }
  }
  const range = upper.at - lower.at || 1;
  const t = (pct - lower.at) / range;
  const [r, g, b] = lower.color.map((c, i) => Math.round(lerp(c, upper.color[i], t)));
  return `rgb(${r}, ${g}, ${b})`;
}

export function densityToRiskLevel(densityPct: number): "low" | "medium" | "high" | "critical" {
  if (densityPct >= 85) return "critical";
  if (densityPct >= 70) return "high";
  if (densityPct >= 40) return "medium";
  return "low";
}
