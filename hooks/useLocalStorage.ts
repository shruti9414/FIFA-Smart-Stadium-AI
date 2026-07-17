"use client";

import { useEffect, useState } from "react";

/** Simple persisted state — used for things like a mock seat/ticket, language preference, or a per-context assistant session token. */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const fallback = initialValue instanceof Function ? initialValue() : initialValue;
    if (typeof window === "undefined") return fallback;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private browsing, quota) — fail silently, non-critical persistence
    }
  }, [key, value]);

  return [value, setValue] as const;
}
