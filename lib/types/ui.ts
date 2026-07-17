/** Shared enums/unions used across components — keep these as the single source of truth for status vocabulary. */
export type Severity = "low" | "medium" | "high" | "critical";
export type RiskLevel = Severity;
export type TrendDirection = "rising" | "falling" | "stable";
export type GateStatus = "open" | "closed" | "congested";
export type IncidentStatus = "reported" | "acknowledged" | "in_progress" | "resolved";
export type ParkingStatus = "open" | "filling" | "full" | "closed";
export type TransportStatus = "on_time" | "delayed" | "crowded" | "suspended";

/** Maps a Severity/RiskLevel to a design-token color name (§9.1 semantic colors). */
export const SEVERITY_COLOR: Record<Severity, "state-success" | "state-warning" | "state-critical"> = {
  low: "state-success",
  medium: "state-warning",
  high: "state-critical",
  critical: "state-critical",
};

export type ComponentSize = "sm" | "md" | "lg";
