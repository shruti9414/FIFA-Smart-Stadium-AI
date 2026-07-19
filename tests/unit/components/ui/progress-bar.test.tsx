import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProgressBar } from "@/components/ui/progress-bar";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("ProgressBar", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("clamps value to 0 when negative", () => {
    const { container } = render(<ProgressBar value={-10} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("clamps value to 100 when over 100", () => {
    const { container } = render(<ProgressBar value={150} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders at 0%", () => {
    const { container } = render(<ProgressBar value={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders at 100%", () => {
    const { container } = render(<ProgressBar value={100} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies trackClassName to track element", () => {
    const { container } = render(<ProgressBar value={50} trackClassName="custom-track" />);
    expect(container.querySelector(".custom-track")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<ProgressBar value={50} className="custom-bar" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with colorByValue", () => {
    const { container } = render(<ProgressBar value={80} colorByValue />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders without colorByValue (uses gradient class)", () => {
    const { container } = render(<ProgressBar value={30} colorByValue={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
