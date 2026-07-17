/**
 * Typed Socket.io event contract shared by lib/socket/server.ts (emit)
 * and lib/socket/client.ts + hooks/useSocket.ts (subscribe). The
 * simulation engine (later phase) is the sole emitter of the domain
 * events below; Phase 1 only establishes the contract and connection
 * plumbing.
 */
export interface CrowdUpdatePayload {
  locationType: "gate" | "section" | "concourse" | "parking";
  locationId: number;
  densityPct: number;
  trend: "rising" | "falling" | "stable";
}

export interface ParkingUpdatePayload {
  lotId: number;
  occupiedSpots: number;
  totalSpots: number;
  status: "open" | "filling" | "full" | "closed";
}

export interface IncidentEventPayload {
  incidentId: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  locationDesc: string;
}

export interface MatchUpdatePayload {
  matchId: number;
  minute: number;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "halftime" | "finished";
}

export interface ConnectionAckPayload {
  connectedAt: string;
}

export interface GateUpdatePayload {
  gateId: number;
  status: "open" | "closed" | "congested";
  queueEstimate: number;
}

export interface SocketEventMap {
  "connection:ack": ConnectionAckPayload;
  "crowd:update": CrowdUpdatePayload;
  "parking:update": ParkingUpdatePayload;
  "incident:new": IncidentEventPayload;
  "incident:update": IncidentEventPayload;
  "match:update": MatchUpdatePayload;
  "gate:update": GateUpdatePayload;
}

/** Client-to-server events — room join/leave, kept separate from the server-to-client map above. */
export interface ClientEmitEvents {
  join: (room: string) => void;
  leave: (room: string) => void;
}
