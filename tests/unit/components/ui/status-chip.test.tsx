import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusChip } from "@/components/ui/status-chip";

describe("StatusChip", () => {
  it("renders the label text", () => {
    render(<StatusChip tone="success" label="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders success tone", () => {
    const { container } = render(<StatusChip tone="success" label="Online" />);
    const dot = container.querySelector(".bg-state-success");
    expect(dot).toBeInTheDocument();
  });

  it("renders warning tone", () => {
    const { container } = render(<StatusChip tone="warning" label="Delayed" />);
    const dot = container.querySelector(".bg-state-warning");
    expect(dot).toBeInTheDocument();
  });

  it("renders critical tone", () => {
    const { container } = render(<StatusChip tone="critical" label="Down" />);
    const dot = container.querySelector(".bg-state-critical");
    expect(dot).toBeInTheDocument();
  });

  it("renders neutral tone", () => {
    const { container } = render(<StatusChip tone="neutral" label="Unknown" />);
    const dot = container.querySelector(".bg-text-muted");
    expect(dot).toBeInTheDocument();
  });

  it("renders info tone", () => {
    const { container } = render(<StatusChip tone="info" label="Info" />);
    const dot = container.querySelector(".bg-accent-cyan");
    expect(dot).toBeInTheDocument();
  });

  it("adds pulse class when pulse=true and tone=critical", () => {
    const { container } = render(<StatusChip tone="critical" label="Alert" pulse />);
    const dot = container.querySelector(".animate-pulse-glow");
    expect(dot).toBeInTheDocument();
  });

  it("does not add pulse class for non-critical tones", () => {
    const { container } = render(<StatusChip tone="success" label="OK" pulse />);
    const dot = container.querySelector(".animate-pulse-glow");
    expect(dot).not.toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<StatusChip tone="neutral" label="Test" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders as a span", () => {
    const { container } = render(<StatusChip tone="success" label="Span" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
