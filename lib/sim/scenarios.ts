import { getAllGates, updateGateQueue, updateGateStatus } from "@/lib/db/gates";
import { insertCrowdReading } from "@/lib/db/crowd";
import { createIncident, getIncidentById } from "@/lib/db/incidents";
import { emitGlobal } from "@/lib/socket/server";

/**
 * Manual demo-scenario triggers (§10.3/§10.4 "Trigger Surge" / scenario
 * button) — the live demo shouldn't be at the mercy of the sim engine's
 * random walk timing. Each trigger writes real facts and emits real
 * events, so it's indistinguishable from an organic sim tick to the UI.
 */

export async function triggerSurge(): Promise<{ gateId: number; sectionId: number | null }> {
  const gates = await getAllGates();
  const gate4 = gates.find((g) => g.name === "Gate 4") ?? gates[0];

  const density = 96;
  await insertCrowdReading("gate", gate4.id, density, "rising");
  await updateGateStatus(gate4.id, "congested");
  await updateGateQueue(gate4.id, 48, 90);
  emitGlobal("crowd:update", { locationType: "gate", locationId: gate4.id, densityPct: density, trend: "rising" });
  emitGlobal("gate:update", { gateId: gate4.id, status: "congested", queueEstimate: 48 });

  if (gate4.section_id) {
    await insertCrowdReading("section", gate4.section_id, 93, "rising");
    emitGlobal("crowd:update", { locationType: "section", locationId: gate4.section_id, densityPct: 93, trend: "rising" });
  }

  return { gateId: gate4.id, sectionId: gate4.section_id };
}

export async function triggerIncident(): Promise<number> {
  const gates = await getAllGates();
  const gate3 = gates.find((g) => g.name === "Gate 3") ?? gates[0];

  const id = await createIncident({
    type: "security",
    severity: "high",
    location_desc: `${gate3.name} perimeter`,
    gate_id: gate3.id,
    section_id: gate3.section_id,
    description: "Security team reports a crowd control situation forming near the gate perimeter.",
    reported_by: "system-sim",
  });

  const incident = await getIncidentById(id);
  if (incident) {
    emitGlobal("incident:new", {
      incidentId: incident.id,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      locationDesc: incident.location_desc ?? "",
    });
  }

  return id;
}
