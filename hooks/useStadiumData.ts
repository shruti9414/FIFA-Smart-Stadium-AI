"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import type { StadiumGate, CrowdDataRow, ParkingRow, IncidentRow, MatchRow, FoodStallRow, TransportRow } from "@/lib/types/db";

/**
 * Shared fetch-then-live-patch pattern reused by Landing, Fan Experience,
 * and Mission Control: fetch the current fact snapshot once on mount
 * directly into the caller's own state, then patch that same state in
 * place as Socket.io events arrive. `loading` starts `true`, so the
 * mount fetch only needs to flip it to `false` on completion (async,
 * inside a .then) — never a synchronous setState inside the effect body.
 */
function useFetchOnce<T>(url: string, setValue: (value: T) => void) {
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    return fetch(url)
      .then((r) => r.json())
      .then((json) => setValue(json.data))
      .finally(() => setLoading(false));
  }, [url, setValue]);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return { loading, refetch };
}

export function useGates() {
  const [gates, setGates] = useState<StadiumGate[]>([]);
  const setValue = useCallback((v: StadiumGate[]) => setGates(v ?? []), []);
  const { loading, refetch } = useFetchOnce<StadiumGate[]>("/api/gates", setValue);

  useSocket("gate:update", (payload) => {
    setGates((prev) => prev.map((g) => (g.id === payload.gateId ? { ...g, status: payload.status, current_queue_estimate: payload.queueEstimate } : g)));
  });

  return { gates, loading, refetch };
}

export function useCrowd() {
  const [crowd, setCrowd] = useState<CrowdDataRow[]>([]);
  const setValue = useCallback((v: CrowdDataRow[]) => setCrowd(v ?? []), []);
  const { loading } = useFetchOnce<CrowdDataRow[]>("/api/crowd", setValue);

  useSocket("crowd:update", (payload) => {
    setCrowd((prev) => {
      const idx = prev.findIndex((c) => c.location_type === payload.locationType && c.location_id === payload.locationId);
      const updated = {
        location_type: payload.locationType,
        location_id: payload.locationId,
        density_pct: payload.densityPct,
        trend: payload.trend,
      } as CrowdDataRow;
      if (idx === -1) return [...prev, updated];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...updated };
      return copy;
    });
  });

  return { crowd, loading };
}

export function useParking() {
  const [parking, setParking] = useState<ParkingRow[]>([]);
  const setValue = useCallback((v: ParkingRow[]) => setParking(v ?? []), []);
  const { loading } = useFetchOnce<ParkingRow[]>("/api/parking", setValue);

  useSocket("parking:update", (payload) => {
    setParking((prev) =>
      prev.map((p) => (p.id === payload.lotId ? { ...p, occupied_spots: payload.occupiedSpots, status: payload.status } : p))
    );
  });

  return { parking, loading };
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const setValue = useCallback((v: IncidentRow[]) => setIncidents(v ?? []), []);
  const { loading, refetch } = useFetchOnce<IncidentRow[]>("/api/incidents", setValue);

  useSocket("incident:new", () => refetch());
  useSocket("incident:update", (payload) => {
    setIncidents((prev) => prev.map((i) => (i.id === payload.incidentId ? { ...i, status: payload.status as IncidentRow["status"] } : i)));
  });

  return { incidents, loading, refetch };
}

export function useMatch() {
  const [match, setMatch] = useState<MatchRow | null>(null);
  const setValue = useCallback((v: MatchRow | null) => setMatch(v ?? null), []);
  const { loading } = useFetchOnce<MatchRow | null>("/api/matches", setValue);

  useSocket("match:update", (payload) => {
    setMatch((prev) => (prev ? { ...prev, minute: payload.minute, home_score: payload.homeScore, away_score: payload.awayScore, status: payload.status } : prev));
  });

  return { match, loading };
}

export function useFoodStalls() {
  const [foodStalls, setFoodStalls] = useState<FoodStallRow[]>([]);
  const setValue = useCallback((v: FoodStallRow[]) => setFoodStalls(v ?? []), []);
  const { loading } = useFetchOnce<FoodStallRow[]>("/api/food-stalls", setValue);
  return { foodStalls, loading };
}

export function useTransport() {
  const [transport, setTransport] = useState<TransportRow[]>([]);
  const setValue = useCallback((v: TransportRow[]) => setTransport(v ?? []), []);
  const { loading } = useFetchOnce<TransportRow[]>("/api/transport", setValue);
  return { transport, loading };
}
