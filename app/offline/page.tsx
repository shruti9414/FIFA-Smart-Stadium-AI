import { WifiOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Service-worker offline fallback (see next.config.ts fallbacks.document).
 * This product's value is live data, so "full offline support" is
 * explicitly out of scope (§7 of the design blueprint) — this page just
 * avoids a broken white screen when connectivity blips.
 */
export default function OfflinePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={WifiOff}
        title="You're offline"
        description="FIFA Smart Stadium AI needs a live connection for real-time crowd data and AI features. Reconnect and reload to continue."
      />
    </div>
  );
}
