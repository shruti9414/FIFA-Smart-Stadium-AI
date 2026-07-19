import { describe, it, expect } from "vitest";
import {
  fallbackBriefing,
  fallbackCommentary,
  fallbackNavigation,
  fallbackAssistantReply,
  fallbackEmergencyDecision,
} from "@/lib/utils/aiFallback";

describe("fallbackBriefing", () => {
  it("returns a non-empty string", () => {
    const result = fallbackBriefing();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(10);
  });

  it("is consistent across calls", () => {
    expect(fallbackBriefing()).toBe(fallbackBriefing());
  });
});

describe("fallbackCommentary", () => {
  it("returns a non-empty string", () => {
    const result = fallbackCommentary();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(5);
  });
});

describe("fallbackNavigation", () => {
  it("returns a NavigationResult shape", () => {
    const result = fallbackNavigation("Concourse A", "Gate 7");
    expect(result).toHaveProperty("steps");
    expect(result).toHaveProperty("recommendedGate");
    expect(result).toHaveProperty("etaMin");
    expect(result).toHaveProperty("confidence");
  });

  it("includes at least one step", () => {
    const { steps } = fallbackNavigation("Food Court", "Gate 3");
    expect(steps.length).toBeGreaterThan(0);
  });

  it("echoes the recommended gate", () => {
    const { recommendedGate } = fallbackNavigation("Exit", "Gate 12");
    expect(recommendedGate).toBe("Gate 12");
  });

  it("returns a positive ETA", () => {
    const { etaMin } = fallbackNavigation("Parking", "Gate 5");
    expect(etaMin).toBeGreaterThan(0);
  });

  it("includes the destination label in one of the steps", () => {
    const dest = "VIP Lounge";
    const { steps } = fallbackNavigation(dest, "Gate 1");
    const mentionsDest = steps.some((s) => s.includes(dest));
    expect(mentionsDest).toBe(true);
  });

  it("has null warning in non-emergency fallback", () => {
    expect(fallbackNavigation("Seat B12", "Gate 2").warning).toBeNull();
  });
});

describe("fallbackAssistantReply", () => {
  it("responds to washroom queries", () => {
    const result = fallbackAssistantReply("Where is the washroom?");
    expect(result.toLowerCase()).toContain("washroom");
  });

  it("responds to bathroom queries", () => {
    const result = fallbackAssistantReply("Need the bathroom");
    expect(result.length).toBeGreaterThan(5);
  });

  it("responds to food queries", () => {
    const result = fallbackAssistantReply("I'm hungry, where can I eat?");
    expect(result.toLowerCase()).toMatch(/food|stall|queue/);
  });

  it("responds to navigation queries", () => {
    const result = fallbackAssistantReply("navigate to my gate");
    expect(result.toLowerCase()).toMatch(/navigate|map|route|section/);
  });

  it("responds to score queries", () => {
    const result = fallbackAssistantReply("What is the current score?");
    expect(result.toLowerCase()).toMatch(/score|match/);
  });

  it("returns a generic reply for unrecognized queries", () => {
    const result = fallbackAssistantReply("xyzzy unknown input");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(10);
  });
});

describe("fallbackEmergencyDecision", () => {
  it("returns EmergencyDecisionResult shape", () => {
    const result = fallbackEmergencyDecision();
    expect(result).toHaveProperty("immediateActions");
    expect(result).toHaveProperty("recommendedUnit");
    expect(result).toHaveProperty("rationale");
    expect(result).toHaveProperty("evacuationNeeded");
    expect(result).toHaveProperty("confidence");
  });

  it("includes at least one immediate action", () => {
    expect(fallbackEmergencyDecision().immediateActions.length).toBeGreaterThan(0);
  });

  it("defaults evacuationNeeded to false in non-critical fallback", () => {
    expect(fallbackEmergencyDecision().evacuationNeeded).toBe(false);
  });

  it("confidence is between 0 and 100", () => {
    const { confidence } = fallbackEmergencyDecision();
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(100);
  });
});
