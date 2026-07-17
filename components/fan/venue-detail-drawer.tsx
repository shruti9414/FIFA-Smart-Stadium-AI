"use client";

import type { LucideIcon } from "lucide-react";
import { Navigation, Star, Footprints, MapPin } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { MiniMapPreview } from "@/components/fan/mini-map-preview";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { seededRange } from "@/lib/utils/seededStats";
import type { VenueCardProps } from "@/components/fan/venue-card";

export type VenueDetail = Pick<VenueCardProps, "icon" | "name" | "category" | "zone" | "headerGradient" | "metricLabel" | "metricValue" | "statusLabel" | "statusTone" | "seedKey">;

interface Props {
  venue: VenueDetail | null;
  onClose: () => void;
  onGetDirections: (venue: VenueDetail) => void;
}

/** Beautiful details drawer opened by tapping any venue card — full venue info + a direct hand-off into Navigate. */
export function VenueDetailDrawer({ venue, onClose, onGetDirections }: Props) {
  const { isDesktop } = useBreakpoint();

  const content = venue ? <VenueDetailContent venue={venue} onGetDirections={onGetDirections} /> : null;

  return isDesktop ? (
    <Drawer open={Boolean(venue)} onClose={onClose} side="right" width={380}>
      {content}
    </Drawer>
  ) : (
    <Sheet open={Boolean(venue)} onClose={onClose} maxHeight="75vh">
      {content}
    </Sheet>
  );
}

function VenueDetailContent({ venue, onGetDirections }: { venue: VenueDetail; onGetDirections: (v: VenueDetail) => void }) {
  const Icon: LucideIcon = venue.icon;
  const rating = seededRange(`${venue.seedKey}-rating`, 3.6, 5.0);
  const walkMin = Math.round(seededRange(`${venue.seedKey}-walk`, 2, 9));
  const distanceM = Math.round(seededRange(`${venue.seedKey}-dist`, 40, 320));

  return (
    <div className="flex h-full flex-col">
      <div className={`relative flex h-36 items-center justify-center overflow-hidden ${venue.headerGradient}`}>
        <Icon size={90} className="absolute -bottom-4 -right-4 text-white/10" strokeWidth={1} />
        <Icon size={36} className="relative z-10 text-white/90" strokeWidth={1.5} />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <h3 className="font-display text-xl font-semibold text-text-primary">{venue.name}</h3>
          <p className="text-sm text-text-secondary">{venue.category}</p>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-text-secondary">
          <span className="flex items-center gap-1 text-state-warning">
            <Star size={13} fill="currentColor" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Footprints size={13} />
            {walkMin} min walk
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {distanceM}m
          </span>
        </div>

        <div className="glass flex items-center justify-between rounded-md p-3">
          <div>
            <p className="text-[10px] uppercase text-text-muted">{venue.metricLabel}</p>
            <p className="font-mono text-sm text-text-primary">{venue.metricValue}</p>
          </div>
          <StatusChip tone={venue.statusTone} label={venue.statusLabel} />
        </div>

        <div className="flex items-center gap-3 rounded-md bg-glass p-3">
          <MiniMapPreview zone={venue.zone} size={44} />
          <div>
            <p className="text-xs text-text-secondary">Located in the</p>
            <p className="text-sm font-medium text-text-primary">{venue.zone} Zone</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle p-4">
        <Button className="w-full" onClick={() => onGetDirections(venue)}>
          <Navigation size={16} />
          Get Directions
        </Button>
      </div>
    </div>
  );
}
