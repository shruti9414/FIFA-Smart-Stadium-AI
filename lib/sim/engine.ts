import { getPool } from "@/lib/db/pool";
import { getAllGates, updateGateQueue, updateGateStatus } from "@/lib/db/gates";
import { getAllSections } from "@/lib/db/sections";
import { getLatestCrowdReadings, insertCrowdReading } from "@/lib/db/crowd";
import { getAllParking, updateParkingOccupancy } from "@/lib/db/parking";
import { getAllFoodStalls, updateFoodStallWait } from "@/lib/db/foodStalls";
import { getLiveMatch, updateMatchState } from "@/lib/db/matches";
import { emitGlobal } from "@/lib/socket/server";
import { mulberry32, randomWalkStep } from "@/lib/utils/prng";
import type { TrendDirection, GateStatus, ParkingStatus } from "@/lib/types/ui";
import type { StadiumGate, StadiumSection, ParkingRow, FoodStallRow } from "@/lib/types/db";

/**
 * Server-side tick loop — the invisible engine that makes every AI
 * feature look real instead of static. Seeded PRNG keeps behavior
 * reproducible across demo runs. The sim engine NEVER calls Gemini
 * directly (§ architecture) — it only mutates facts and emits events;
 * AI calls are always triggered by client action or a thin threshold
 * check living in the client/route layer.
 */

const TICK_MS = 6000;
const rng = mulberry32(42);

interface LocationState {
  density: number;
  trend: TrendDirection;
}

let gates: StadiumGate[] = [];
let sections: StadiumSection[] = [];
let parkingLots: ParkingRow[] = [];
let foodStalls: FoodStallRow[] = [];
let densityState = new Map<string, LocationState>();

let started = false;
let intervalHandle: ReturnType<typeof setInterval> | null = null;

function key(type: string, id: number) {
  return `${type}:${id}`;
}

async function loadInitialState() {
  gates = await getAllGates();
  sections = await getAllSections();
  parkingLots = await getAllParking();
  foodStalls = await getAllFoodStalls();

  const readings = await getLatestCrowdReadings();
  densityState = new Map(
    readings.map((r) => [
      key(r.location_type, r.location_id),
      { density: Number(r.density_pct), trend: r.trend },
    ])
  );
}

function nextTrend(current: TrendDirection): TrendDirection {
  // Trends persist with momentum rather than pure noise — occasionally flip.
  if (rng() < 0.12) {
    const options: TrendDirection[] = ["rising", "falling", "stable"];
    return options[Math.floor(rng() * options.length)];
  }
  return current;
}

function trendDelta(trend: TrendDirection): number {
  if (trend === "rising") return 1.5 + rng() * 2.5;
  if (trend === "falling") return -(1.5 + rng() * 2.5);
  return (rng() - 0.5) * 1.5;
}

async function tickCrowd() {
  for (const gate of gates) {
    if (gate.status === "closed") continue; // closed gates stay at 0 until manually reopened
    const k = key("gate", gate.id);
    const state = densityState.get(k) ?? { density: 30, trend: "stable" as TrendDirection };
    const trend = nextTrend(state.trend);
    const density = Math.round(Math.max(0, Math.min(100, state.density + trendDelta(trend))) * 100) / 100;
    densityState.set(k, { density, trend });

    await insertCrowdReading("gate", gate.id, density, trend);

    // Density feeds back into gate status/queue — a real correlation the UI/AI both read from.
    const newStatus: GateStatus = density >= 80 ? "congested" : "open";
    const newQueue = Math.round(density * 0.4 + rng() * 5);
    if (newStatus !== gate.status) {
      await updateGateStatus(gate.id, newStatus);
      gate.status = newStatus;
    }
    await updateGateQueue(gate.id, newQueue, Math.max(80, 320 - Math.round(density * 2)));

    emitGlobal("crowd:update", { locationType: "gate", locationId: gate.id, densityPct: density, trend });
  }

  for (const section of sections) {
    const k = key("section", section.id);
    const state = densityState.get(k) ?? { density: 30, trend: "stable" as TrendDirection };
    const trend = nextTrend(state.trend);
    const density = Math.round(Math.max(0, Math.min(100, state.density + trendDelta(trend))) * 100) / 100;
    densityState.set(k, { density, trend });

    await insertCrowdReading("section", section.id, density, trend);
    emitGlobal("crowd:update", { locationType: "section", locationId: section.id, densityPct: density, trend });
  }
}

async function tickParking() {
  for (const lot of parkingLots) {
    const occupied = Math.round(
      randomWalkStep(lot.occupied_spots, rng, { min: 0, max: lot.total_spots, maxDelta: lot.total_spots * 0.02 })
    );
    const pct = occupied / lot.total_spots;
    const status: ParkingStatus = pct >= 1 ? "full" : pct >= 0.85 ? "filling" : "open";
    lot.occupied_spots = occupied;
    lot.status = status;
    await updateParkingOccupancy(lot.id, occupied, status);
    emitGlobal("parking:update", { lotId: lot.id, occupiedSpots: occupied, totalSpots: lot.total_spots, status });
  }
}

async function tickFood() {
  for (const stall of foodStalls) {
    const wait = Math.max(0, Math.round(randomWalkStep(stall.wait_time_min, rng, { min: 0, max: 30, maxDelta: 2 })));
    stall.wait_time_min = wait;
    await updateFoodStallWait(stall.id, wait);
  }
}

let tickCount = 0;
async function tickMatch() {
  tickCount++;
  const match = await getLiveMatch();
  if (!match || match.status !== "live") return;
  if (tickCount % 2 !== 0) return; // advance match time roughly every other tick

  const minute = Math.min(90, match.minute + 1);
  await updateMatchState(match.id, { minute });
  emitGlobal("match:update", {
    matchId: match.id,
    minute,
    homeScore: match.home_score,
    awayScore: match.away_score,
    status: match.status,
  });
}

async function tick() {
  try {
    await tickCrowd();
    await tickParking();
    await tickFood();
    await tickMatch();
  } catch (err) {
    console.error("[sim] tick error", err);
  }
}

export async function startSimEngine(): Promise<void> {
  if (started) return;
  started = true;
  await getPool().query("SELECT 1"); // fail fast if DB is unreachable
  await loadInitialState();
  intervalHandle = setInterval(tick, TICK_MS);
  console.log(`[sim] engine started — ticking every ${TICK_MS / 1000}s`);
}

export function stopSimEngine(): void {
  if (intervalHandle) clearInterval(intervalHandle);
  started = false;
}
