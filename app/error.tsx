"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <ErrorState
        title="This section hit a snag"
        description="Something failed to render. You can try again — the rest of the app is unaffected."
        onRetry={reset}
      />
    </div>
  );
}
