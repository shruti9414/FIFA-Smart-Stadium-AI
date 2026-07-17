import type {
  GateStatus,
  IncidentStatus,
  ParkingStatus,
  Severity,
  TransportStatus,
  TrendDirection,
} from "@/lib/types/ui";

/** Row types mirroring scripts/db-init.sql — the facts layer's shape. */

export interface StadiumSection {
  id: number;
  name: string;
  zone: string;
  capacity: number;
  tier: string | null;
}

export interface StadiumGate {
  id: number;
  name: string;
  zone: string;
  status: GateStatus;
  current_queue_estimate: number;
  throughput_per_min: number;
  section_id: number | null;
  lat: number | null;
  lng: number | null;
}

export interface CrowdDataRow {
  id: number;
  location_type: "gate" | "section" | "concourse" | "parking" | "general";
  location_id: number;
  density_pct: number;
  people_count_estimate: number | null;
  trend: TrendDirection;
  recorded_at: string;
}

export interface ParkingRow {
  id: number;
  lot_name: string;
  total_spots: number;
  occupied_spots: number;
  status: ParkingStatus;
  lat: number | null;
  lng: number | null;
}

export interface FoodStallRow {
  id: number;
  name: string;
  category: string | null;
  zone: string;
  wait_time_min: number;
  status: "open" | "closed" | "sold_out";
  popularity_score: number;
}

export interface MatchRow {
  id: number;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: "scheduled" | "live" | "halftime" | "finished";
  kickoff_at: string;
  stage: string | null;
  venue: string;
  minute: number;
}

export interface MatchEventRow {
  id: number;
  match_id: number;
  minute: number;
  event_type: "goal" | "yellow_card" | "red_card" | "substitution" | "var" | "kickoff" | "halftime" | "fulltime";
  team: string | null;
  player: string | null;
  detail: string | null;
}

export interface MatchSummaryRow {
  id: number;
  match_id: number;
  summary_text: string;
  based_on_event_count: number;
  generated_at: string;
}

export interface IncidentRow {
  id: number;
  type: "medical" | "security" | "crowd_surge" | "fire" | "weather" | "lost_item" | "other";
  severity: Severity;
  status: IncidentStatus;
  location_desc: string | null;
  gate_id: number | null;
  section_id: number | null;
  description: string | null;
  reported_by: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentAiNoteRow {
  id: number;
  incident_id: number;
  note_type: "summary" | "decision_support" | "commander_plan";
  content: string;
  confidence: number | null;
  generated_at: string;
}

export interface TransportRow {
  id: number;
  mode: "shuttle" | "metro" | "rideshare" | "bus";
  route_name: string | null;
  status: TransportStatus;
  next_arrival_min: number | null;
  capacity_pct: number;
}

export interface ChatSessionRow {
  id: number;
  session_token: string;
  language: string;
  context: "fan" | "ops";
  created_at: string;
}

export interface ChatHistoryRow {
  id: number;
  session_id: number;
  role: "user" | "assistant";
  message: string;
  intent: string | null;
  created_at: string;
}

export interface StaffRow {
  id: number;
  name: string | null;
  role: "security" | "medical" | "steward" | "manager";
  assigned_gate_id: number | null;
  status: "available" | "deployed" | "off_duty";
}
