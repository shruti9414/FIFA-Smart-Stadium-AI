import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

describe("useBreakpoint", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1280 });
  });

  it("returns width, breakpoint, isMobile, isDesktop", () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toHaveProperty("width");
    expect(result.current).toHaveProperty("breakpoint");
    expect(result.current).toHaveProperty("isMobile");
    expect(result.current).toHaveProperty("isDesktop");
  });

  it("reports isDesktop=true at 1280px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1280 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it("reports isMobile=true at 600px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 600 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("breakpoint is 'xl' at 1280px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1280 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe("xl");
  });

  it("breakpoint is 'sm' at 640px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 640 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe("sm");
  });

  it("breakpoint is 'base' at 320px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe("base");
  });

  it("breakpoint is '2xl' at 1536px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1600 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe("2xl");
  });

  it("width matches window.innerWidth", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 900 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.width).toBe(900);
  });
});
