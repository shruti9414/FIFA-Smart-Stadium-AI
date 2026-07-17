"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/shared/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { CircleCheck } from "lucide-react";
import { IncidentList } from "@/components/ops/incident-list";
import { IncidentDetail } from "@/components/ops/incident-detail";
import { CommanderMode } from "@/components/ops/commander-mode";
import { useIncidents } from "@/hooks/useStadiumData";

export default function IncidentCenterPage() {
  const { incidents, refetch } = useIncidents();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [commanderMode, setCommanderMode] = useState(false);

  // Load incident from query parameter if provided
  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        setSelectedId(id);
      }
    }
  }, [searchParams]);

  const activeCount = incidents.filter((i) => i.status !== "resolved").length;
  const canEscalate = activeCount >= 2;

  // Derived, not effect-synced: default to the first incident until the user picks one explicitly.
  const effectiveSelectedId = selectedId ?? incidents[0]?.id ?? null;
  const selected = incidents.find((i) => i.id === effectiveSelectedId);

  const triggerDemoIncident = async () => {
    await fetch("/api/sim/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: "incident" }),
    });
    refetch();
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        title="Incident Center"
        left={
          <Link href="/ops">
            <IconButton icon={ArrowLeft} label="Back to Mission Control" size="sm" variant="ghost" />
          </Link>
        }
        right={
          <Tooltip content="Inject a demo incident">
            <IconButton icon={FlaskConical} label="Trigger demo incident" size="sm" variant="ghost" onClick={triggerDemoIncident} />
          </Tooltip>
        }
      />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_1fr]">
        <div className="hidden border-r border-border-subtle lg:block">
          <IncidentList incidents={incidents} selectedId={effectiveSelectedId} onSelect={(id) => { setSelectedId(id); setCommanderMode(false); }} />
        </div>

        <div className="lg:hidden">
          {!selectedId ? (
            <IncidentList incidents={incidents} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <div className="border-b border-border-subtle p-2">
              <IconButton icon={ArrowLeft} label="Back to list" size="sm" variant="ghost" onClick={() => setSelectedId(null)} />
            </div>
          )}
        </div>

        <div className="overflow-y-auto">
          <AnimatePresence mode="wait">
            {commanderMode ? (
              <CommanderMode key="commander" onDeescalate={() => setCommanderMode(false)} />
            ) : selected ? (
              <div key={selected.id} className="hidden lg:block">
                <IncidentDetail incident={selected} canEscalate={canEscalate} onEscalate={() => setCommanderMode(true)} />
              </div>
            ) : null}
          </AnimatePresence>

          {!commanderMode && selected && (
            <div key={selected.id} className="lg:hidden">
              <IncidentDetail incident={selected} canEscalate={canEscalate} onEscalate={() => setCommanderMode(true)} />
            </div>
          )}

          {!commanderMode && !selected && incidents.length === 0 && (
            <EmptyState icon={CircleCheck} title="All clear" description="No active incidents. Use the flask icon above to inject a demo scenario." />
          )}
        </div>
      </div>
    </div>
  );
}
