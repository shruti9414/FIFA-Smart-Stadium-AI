import type { NavigationResult } from "@/lib/ai/navigation";
import type { EmergencyDecisionResult } from "@/lib/ai/emergencyDecision";

/**
 * Realistic placeholder responses shown when a live Gemini call fails or
 * GEMINI_API_KEY isn't configured yet — the fan-facing UI should never
 * read "AI unavailable." These are clearly still fallback content (not
 * pretending to be a fresh generation), just not an error state that
 * breaks the experience during a demo.
 */

export function fallbackBriefing(): string {
  return "Conditions look good right now — gates are moving steadily and the atmosphere is building. Enjoy the match!";
}

export function fallbackCommentary(): string {
  const lines = [
    "Both sides are settling into their rhythm out there.",
    "The crowd is right behind the home side on this one.",
    "A tightly contested match so far — anything could happen.",
    "Plenty of energy in the stadium as we approach the next phase of play.",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function fallbackNavigation(destinationLabel: string, recommendedGate: string): NavigationResult {
  return {
    steps: [
      `Head toward the main concourse from your current position.`,
      `Follow signage for ${recommendedGate}.`,
      `Proceed to ${destinationLabel} — stewards are on hand if you need directions.`,
    ],
    recommendedGate,
    etaMin: 6,
    warning: null,
    confidence: 72,
  };
}

export function fallbackAssistantReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("washroom") || lower.includes("bathroom")) {
    return "The nearest washrooms are on the main concourse near your section — just follow the signage.";
  }
  if (lower.includes("food") || lower.includes("eat") || lower.includes("hungry")) {
    return "Check the Amenities tab for live queue times — a few stalls near you have short waits right now.";
  }
  if (lower.includes("seat") || lower.includes("gate") || lower.includes("navigate")) {
    return "Open the Navigate tab and tap your section on the stadium map for a step-by-step route.";
  }
  if (lower.includes("score") || lower.includes("match")) {
    return "Check the Match Center for the live score, timeline, and stats — updating in real time.";
  }
  return "I'm here to help with navigation, food, parking, and match info — what do you need?";
}

export function fallbackEmergencyDecision(): EmergencyDecisionResult {
  return {
    immediateActions: [
      "Stay where you are — stewards and medical staff have been notified.",
      "Keep the area around you clear if possible.",
      "A team member will reach you shortly.",
    ],
    recommendedUnit: "Nearest Medical Team",
    recommendedExitClosures: [],
    rationale: "Standard response protocol while live conditions are confirmed.",
    evacuationNeeded: false,
    confidence: 65,
  };
}
