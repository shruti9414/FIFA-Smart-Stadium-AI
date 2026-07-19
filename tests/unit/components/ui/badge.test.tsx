import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with default neutral tone", () => {
    const { container } = render(<Badge>Neutral</Badge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with success tone", () => {
    render(<Badge tone="success">Open</Badge>);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders with warning tone", () => {
    render(<Badge tone="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("renders with critical tone", () => {
    render(<Badge tone="critical">Critical</Badge>);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("renders with info tone", () => {
    render(<Badge tone="info">Info</Badge>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("accepts extra className", () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>Span</Badge>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("passes through HTML attributes", () => {
    render(<Badge data-testid="my-badge">Label</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});
