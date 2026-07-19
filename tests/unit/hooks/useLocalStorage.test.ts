import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("key-a", "hello"));
    expect(result.current[0]).toBe("hello");
  });

  it("accepts a factory function as initial value", () => {
    const { result } = renderHook(() => useLocalStorage("key-b", () => 42));
    expect(result.current[0]).toBe(42);
  });

  it("persists value to localStorage on set", () => {
    const { result } = renderHook(() => useLocalStorage("key-c", "initial"));
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("key-c")!)).toBe("updated");
  });

  it("reads existing value from localStorage", () => {
    window.localStorage.setItem("key-d", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("key-d", "default"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("handles object values", () => {
    const { result } = renderHook(() => useLocalStorage("key-obj", { count: 0 }));
    act(() => {
      result.current[1]({ count: 5 });
    });
    expect(result.current[0]).toEqual({ count: 5 });
  });

  it("handles boolean values", () => {
    const { result } = renderHook(() => useLocalStorage("key-bool", false));
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
  });

  it("handles array values", () => {
    const { result } = renderHook(() => useLocalStorage<string[]>("key-arr", []));
    act(() => {
      result.current[1](["a", "b", "c"]);
    });
    expect(result.current[0]).toEqual(["a", "b", "c"]);
  });

  it("falls back to initialValue on JSON parse error", () => {
    window.localStorage.setItem("key-bad", "{ not valid json }");
    const { result } = renderHook(() => useLocalStorage("key-bad", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("supports functional updates via setState", () => {
    const { result } = renderHook(() => useLocalStorage("key-fn", 0));
    act(() => {
      result.current[1]((prev: number) => prev + 10);
    });
    expect(result.current[0]).toBe(10);
  });
});
