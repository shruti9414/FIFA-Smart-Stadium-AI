import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState, InlineErrorNotice } from "@/components/ui/error-state";

describe("ErrorState", () => {
  it("renders the default title", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders the default description", () => {
    render(<ErrorState />);
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<ErrorState title="Connection lost" />);
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
  });

  it("renders a custom description", () => {
    render(<ErrorState description="Please check your network." />);
    expect(screen.getByText("Please check your network.")).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    render(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("does not render retry button when onRetry not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when Try again is clicked", async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("accepts custom className", () => {
    const { container } = render(<ErrorState className="custom-err" />);
    expect(container.firstChild).toHaveClass("custom-err");
  });
});

describe("InlineErrorNotice", () => {
  it("renders the message", () => {
    render(<InlineErrorNotice message="AI unavailable" />);
    expect(screen.getByText("AI unavailable")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<InlineErrorNotice message="Error" className="my-notice" />);
    expect(container.firstChild).toHaveClass("my-notice");
  });
});
