import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("returns empty string when no args", () => {
    expect(cn()).toBe("");
  });

  it("joins class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps non-conflicting classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("accepts conditional objects", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });

  it("accepts arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("merges background and text colors independently", () => {
    const result = cn("bg-red-500 text-white", "bg-blue-500");
    expect(result).toBe("text-white bg-blue-500");
  });
});
