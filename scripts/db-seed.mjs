// Populates a single fixed demo stadium/match scenario. Deliberately
// pre-loads a realistic tension into the data (Gate 4 congested + Gate 4B
// closed, a rising Section 208 trend, one active medical incident) so the
// flagship "AI correlates density + incident + closed gate -> reopen 4B"
// demo moment works reliably without depending on sim-engine randomness.
//
// Run with: npm run db:seed  (requires `npm run db:init` first)
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "fifa_smart_stadium",
});

async function insert(table, row) {
  const cols = Object.keys(row);
  const placeholders = cols.map(() => "?").join(", ");
  const [result] = await connection.query(
    `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`,
    cols.map((c) => row[c])
  );
  return result.insertId;
}

function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60_000).toISOString().slice(0, 19).replace("T", " ");
}

console.log("Clearing existing demo data...");
for (const table of [
  "chat_history",
  "chat_sessions",
  "incident_ai_notes",
  "incidents",
  "match_summaries",
  "match_events",
  "matches",
  "transport",
  "food_stalls",
  "parking",
  "crowd_data",
  "staff",
  "stadium_gates",
  "stadium_sections",
]) {
  await connection.query(`DELETE FROM ${table}`);
  await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
}

console.log("Seeding stadium sections + gates...");

const sections = {};
sections.s101 = await insert("stadium_sections", { name: "Section 101", zone: "North", capacity: 3200, tier: "Lower" });
sections.s112 = await insert("stadium_sections", { name: "Section 112", zone: "North", capacity: 2800, tier: "Upper" });
sections.s208 = await insert("stadium_sections", { name: "Section 208", zone: "East", capacity: 3000, tier: "Lower" });
sections.s214 = await insert("stadium_sections", { name: "Section 214", zone: "East", capacity: 1500, tier: "Club" });
sections.s305 = await insert("stadium_sections", { name: "Section 305", zone: "South", capacity: 3200, tier: "Lower" });
sections.s318 = await insert("stadium_sections", { name: "Section 318", zone: "South", capacity: 2600, tier: "Upper" });
sections.s402 = await insert("stadium_sections", { name: "Section 402", zone: "West", capacity: 3000, tier: "Lower" });
sections.s410 = await insert("stadium_sections", { name: "Section 410", zone: "West", capacity: 1200, tier: "Club" });

const gates = {};
gates.g1 = await insert("stadium_gates", { name: "Gate 1", zone: "South", status: "open", current_queue_estimate: 6, throughput_per_min: 300, section_id: sections.s305 });
gates.g2 = await insert("stadium_gates", { name: "Gate 2", zone: "South", status: "open", current_queue_estimate: 4, throughput_per_min: 280, section_id: sections.s318 });
gates.g3 = await insert("stadium_gates", { name: "Gate 3", zone: "North", status: "congested", current_queue_estimate: 26, throughput_per_min: 190, section_id: sections.s101 });
gates.g3b = await insert("stadium_gates", { name: "Gate 3B", zone: "North", status: "open", current_queue_estimate: 3, throughput_per_min: 260, section_id: sections.s112 });
gates.g4 = await insert("stadium_gates", { name: "Gate 4", zone: "East", status: "congested", current_queue_estimate: 34, throughput_per_min: 150, section_id: sections.s208 });
gates.g4b = await insert("stadium_gates", { name: "Gate 4B", zone: "East", status: "closed", current_queue_estimate: 0, throughput_per_min: 0, section_id: sections.s214 });
gates.g5 = await insert("stadium_gates", { name: "Gate 5", zone: "West", status: "open", current_queue_estimate: 12, throughput_per_min: 270, section_id: sections.s402 });
gates.g6 = await insert("stadium_gates", { name: "Gate 6", zone: "West", status: "open", current_queue_estimate: 5, throughput_per_min: 240, section_id: sections.s410 });

console.log("Seeding crowd density history...");

// [gate/section key, locationType, id, latest density, trend, per-step delta over the last 8 readings]
const densitySeries = [
  ["gate", gates.g1, 40, "stable", 1],
  ["gate", gates.g2, 35, "stable", -1],
  ["gate", gates.g3, 82, "rising", 5],
  ["gate", gates.g3b, 25, "stable", 0.5],
  ["gate", gates.g4, 91, "rising", 6],
  ["gate", gates.g4b, 0, "stable", 0],
  ["gate", gates.g5, 55, "rising", 3],
  ["gate", gates.g6, 30, "falling", -3],
  ["section", sections.s101, 68, "rising", 4],
  ["section", sections.s112, 44, "stable", 1],
  ["section", sections.s208, 85, "rising", 5.5],
  ["section", sections.s214, 52, "stable", 1.5],
  ["section", sections.s305, 41, "stable", 0.5],
  ["section", sections.s318, 22, "falling", -2],
  ["section", sections.s402, 58, "rising", 3.5],
  ["section", sections.s410, 30, "stable", 1],
];

const READINGS = 8;
const STEP_MINUTES = 4;
for (const [locationType, locationId, latest, trend, delta] of densitySeries) {
  for (let i = READINGS - 1; i >= 0; i--) {
    const value = Math.max(0, Math.min(100, latest - delta * i));
    await insert("crowd_data", {
      location_type: locationType,
      location_id: locationId,
      density_pct: value.toFixed(2),
      people_count_estimate: Math.round(value * 30),
      trend,
      recorded_at: minutesAgo(i * STEP_MINUTES),
    });
  }
}

console.log("Seeding parking...");
await insert("parking", { lot_name: "Lot A — North", total_spots: 1200, occupied_spots: 640, status: "open" });
await insert("parking", { lot_name: "Lot B — East", total_spots: 900, occupied_spots: 810, status: "filling" });
await insert("parking", { lot_name: "Lot C — South", total_spots: 1000, occupied_spots: 300, status: "open" });
await insert("parking", { lot_name: "Lot D — West", total_spots: 800, occupied_spots: 500, status: "open" });

console.log("Seeding food stalls...");
const foodStalls = [
  ["Northside Grill", "Burgers", "North", 12],
  ["Halal Corner", "Halal", "North", 4],
  ["Cold Brew Co.", "Beverages", "North", 2],
  ["East End Tacos", "Mexican", "East", 18],
  ["Veggie Kitchen", "Vegetarian", "East", 6],
  ["South Pizza Co.", "Pizza", "South", 9],
  ["Ice Cream Stand", "Dessert", "South", 3],
  ["West Wings", "Chicken", "West", 15],
  ["Sushi Express", "Asian", "West", 7],
  ["Pretzel Post", "Snacks", "West", 1],
];
for (const [name, category, zone, wait] of foodStalls) {
  await insert("food_stalls", { name, category, zone, wait_time_min: wait, status: "open", popularity_score: (Math.random() * 2 + 3).toFixed(2) });
}

console.log("Seeding transport...");
await insert("transport", { mode: "shuttle", route_name: "Shuttle Line A — North Loop", status: "on_time", next_arrival_min: 6, capacity_pct: 55 });
await insert("transport", { mode: "shuttle", route_name: "Shuttle Line B — East Loop", status: "delayed", next_arrival_min: 14, capacity_pct: 88 });
await insert("transport", { mode: "metro", route_name: "Red Line", status: "crowded", next_arrival_min: 3, capacity_pct: 92 });
await insert("transport", { mode: "rideshare", route_name: "Rideshare Pickup Zone", status: "on_time", next_arrival_min: 2, capacity_pct: 40 });

console.log("Seeding staff...");
await insert("staff", { name: "J. Alvarez", role: "security", assigned_gate_id: gates.g4, status: "deployed" });
await insert("staff", { name: "M. Chen", role: "security", assigned_gate_id: gates.g3, status: "deployed" });
await insert("staff", { name: "R. Okafor", role: "security", assigned_gate_id: null, status: "available" });
await insert("staff", { name: "Dr. S. Patel", role: "medical", assigned_gate_id: gates.g4, status: "deployed" });
await insert("staff", { name: "Dr. L. Novak", role: "medical", assigned_gate_id: null, status: "available" });
await insert("staff", { name: "T. Osei", role: "steward", assigned_gate_id: gates.g1, status: "deployed" });
await insert("staff", { name: "A. Fischer", role: "steward", assigned_gate_id: null, status: "available" });
await insert("staff", { name: "K. Diallo", role: "manager", assigned_gate_id: null, status: "available" });

console.log("Seeding match + events...");
const matchId = await insert("matches", {
  home_team: "Brazil",
  away_team: "Argentina",
  home_score: 1,
  away_score: 1,
  status: "live",
  kickoff_at: minutesAgo(58),
  stage: "Group Stage — Matchday 3",
  venue: "MetLife Stadium",
  minute: 58,
});
await insert("match_events", { match_id: matchId, minute: 0, event_type: "kickoff", team: null, player: null, detail: "Kickoff" });
await insert("match_events", { match_id: matchId, minute: 23, event_type: "goal", team: "Brazil", player: "Vinícius Júnior", detail: "Low finish from inside the box" });
await insert("match_events", { match_id: matchId, minute: 35, event_type: "yellow_card", team: "Argentina", player: "L. Paredes", detail: "Tactical foul" });
await insert("match_events", { match_id: matchId, minute: 45, event_type: "halftime", team: null, player: null, detail: "Half-time" });
await insert("match_events", { match_id: matchId, minute: 49, event_type: "goal", team: "Argentina", player: "Julián Álvarez", detail: "Header from a corner" });

console.log("Seeding incidents...");
await insert("incidents", {
  type: "medical",
  severity: "medium",
  status: "in_progress",
  location_desc: "Section 208 concourse",
  gate_id: gates.g4,
  section_id: sections.s208,
  description: "Fan reported feeling unwell near the Section 208 entrance. Medical team dispatched.",
  reported_by: "Steward Team B",
  created_at: minutesAgo(9),
});
await insert("incidents", {
  type: "security",
  severity: "low",
  status: "resolved",
  location_desc: "Gate 1 perimeter",
  gate_id: gates.g1,
  section_id: sections.s305,
  description: "Minor queue dispute at Gate 1, resolved by stewards on site.",
  reported_by: "T. Osei",
  created_at: minutesAgo(41),
});

console.log("Seed complete: 8 sections, 8 gates, 16 density series (8 readings each), 4 parking lots, 10 food stalls, 4 transport routes, 8 staff, 1 live match with 5 events, 2 incidents.");
await connection.end();
