/** Thousands-separated integer, e.g. 14382 -> "14,382" — used by StatTile/countUp. */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/** "2m ago", "just now" — used by tickers, incident timestamps, chat_history. */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.round((now.getTime() - then) / 1000));
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(iso).toLocaleDateString();
}

/** HH:MM (24h, mono display) — match minute markers, ticker timestamps. */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Confidence/percentage display, e.g. 0.873 or 87 -> "87%". */
export function formatPercent(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(pct)}%`;
}
