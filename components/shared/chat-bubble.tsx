import { AIBadge } from "@/components/shared/ai-badge";
import { StreamingText } from "@/components/shared/streaming-text";
import { cn } from "@/lib/utils/cn";

export interface ChatBubbleProps {
  role: "user" | "assistant";
  text: string;
  animate?: boolean;
  proactive?: boolean;
}

/** User messages: right-aligned, plain. Assistant messages: left-aligned, AI-badged, revealed with streamText — the concrete fact-vs-AI visual distinction inside free-form chat (§3.5). */
export function ChatBubble({ role, text, animate = false, proactive = false }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-md rounded-tr-xs bg-glass-elevated px-3.5 py-2.5 text-sm text-text-primary">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[85%] space-y-1.5 rounded-md rounded-tl-xs border-l-2 px-3.5 py-2.5 text-sm",
          proactive ? "border-l-accent-emerald bg-accent-emerald/5" : "border-l-accent-cyan bg-accent-cyan/5"
        )}
      >
        <div className="flex items-center gap-1.5">
          <AIBadge />
          {proactive && <span className="text-[10px] uppercase tracking-wide text-accent-emerald">Noticed something</span>}
        </div>
        <div className="text-text-primary">{animate ? <StreamingText text={text} /> : text}</div>
      </div>
    </div>
  );
}
