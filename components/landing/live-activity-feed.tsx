"use client";

import { useMemo } from "react";
import { Ticker, type TickerItem } from "@/components/shared/ticker";
import { useGates, useIncidents, useMatch, useCrowd } from "@/hooks/useStadiumData";
import { formatNumber } from "@/lib/utils/format";

/** §10.1 fold-1 ticker — real facts synthesized into live-feeling status lines, not canned copy. */
export function LiveActivityFeed() {
  const { gates } = useGates();
  const { incidents } = useIncidents();
  const { match } = useMatch();
  const { crowd } = useCrowd();

  const items = useMemo<TickerItem[]>(() => {
    const list: TickerItem[] = [];

    const congested = gates.filter((g) => g.status === "congested");
    for (const g of congested) list.push({ id: `gate-${g.id}`, text: `${g.name} — high congestion, queue ~${g.current_queue_estimate} min` });

    const closed = gates.filter((g) => g.status === "closed");
    for (const g of closed) list.push({ id: `gateclosed-${g.id}`, text: `${g.name} — currently closed` });

    for (const i of incidents.filter((i) => i.status !== "resolved")) {
      list.push({ id: `incident-${i.id}`, text: `Active ${i.severity} ${i.type} incident — ${i.location_desc}` });
    }

    const totalPeople = crowd
      .filter((c) => c.location_type === "section")
      .reduce((sum, c) => sum + (c.people_count_estimate ?? 0), 0);
    if (totalPeople > 0) list.push({ id: "attendance", text: `${formatNumber(totalPeople)} fans currently inside the stadium` });

    if (match) list.push({ id: "match", text: `${match.home_team} ${match.home_score}-${match.away_score} ${match.away_team} — ${match.minute}'` });

    if (list.length === 0) {
      list.push(
        { id: "seed-1", text: "System online — live stadium intelligence active" },
        { id: "seed-2", text: "Monitoring 8 gates, 8 sections, 4 parking lots" },
        { id: "seed-3", text: "AI reasoning engine ready" }
      );
    }

    return list;
  }, [gates, incidents, match, crowd]);

  return <Ticker items={items} />;
}
