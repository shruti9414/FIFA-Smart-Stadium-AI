"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, X, Send, Globe, Mic } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Sheet } from "@/components/ui/sheet";
import { IconButton } from "@/components/ui/icon-button";
import { TextInput } from "@/components/ui/text-input";
import { SuggestedPromptChip } from "@/components/ui/suggested-prompt-chip";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { ChatBubble } from "@/components/shared/chat-bubble";
import { TypingIndicator } from "@/components/shared/typing-indicator";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { fallbackAssistantReply } from "@/lib/utils/aiFallback";
import { cn } from "@/lib/utils/cn";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
];

interface Message {
  role: "user" | "assistant";
  text: string;
  animate?: boolean;
}

const SUGGESTIONS: Record<"fan" | "ops", string[]> = {
  fan: ["Where's the nearest washroom?", "How do I get to my seat?", "What's the score?"],
  ops: ["Summarize current risk", "Why is Gate 4 congested?", "Any active incidents?"],
};

export interface AssistantLauncherProps {
  context: "fan" | "ops";
  extraFacts?: Record<string, unknown>;
}

export function AssistantLauncher({ context, extraFacts }: AssistantLauncherProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [language, setLanguage] = useLocalStorage("assistant-language", "en");
  const [sessionToken] = useLocalStorage(`assistant-session-${context}`, () => crypto.randomUUID());
  const { isDesktop } = useBreakpoint();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { listening, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput((text) => setInput(text));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || sending) return;
      setMessages((prev) => [...prev, { role: "user", text }]);
      setInput("");
      setSending(true);

      try {
        const res = await fetch("/api/ai/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken, context, language, message: text, extraFacts }),
        });
        if (!res.ok) {
          setMessages((prev) => [...prev, { role: "assistant", text: fallbackAssistantReply(text), animate: true }]);
          return;
        }
        const json = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", text: json.data.reply, animate: true }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", text: fallbackAssistantReply(text), animate: true }]);
      } finally {
        setSending(false);
      }
    },
    [sending, sessionToken, context, language, extraFacts]
  );

  const content = (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle px-4">
        <div className="flex items-center gap-2">
          <div className="gradient-ai-core flex h-8 w-8 items-center justify-center rounded-full">
            <Sparkles size={16} className="text-void" strokeWidth={2} />
          </div>
          <span className="font-display text-sm font-semibold text-text-primary">Stadium Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Assistant language"
              className="glass appearance-none rounded-xs py-1 pl-7 pr-2 text-xs text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-surface">
                  {l.label}
                </option>
              ))}
            </select>
            <Globe size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          <IconButton icon={X} label="Close" size="sm" variant="ghost" onClick={() => setOpen(false)} />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="gradient-ai-core flex h-10 w-10 items-center justify-center rounded-full">
              <Sparkles size={20} className="text-void" strokeWidth={2} />
            </div>
            <p className="text-sm text-text-secondary">
              Ask me anything about {context === "fan" ? "the stadium, your seat, or the match" : "current operations"}.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS[context].map((s) => (
                <SuggestedPromptChip key={s} onClick={() => send(s)}>
                  {s}
                </SuggestedPromptChip>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} animate={m.animate} />
        ))}
        {sending && <TypingIndicator />}
      </div>

      <form
        className="flex shrink-0 items-center gap-2 border-t border-border-subtle p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening..." : "Ask the assistant..."}
          className="flex-1 rounded-full"
        />
        {voiceSupported && (
          <IconButton
            icon={Mic}
            label={listening ? "Stop voice input" : "Voice input"}
            variant={listening ? "solid" : "glass"}
            type="button"
            onClick={toggleVoice}
            className={cn(listening && "animate-pulse-glow")}
          />
        )}
        <IconButton icon={Send} label="Send" variant="solid" type="submit" disabled={sending || !input.trim()} />
      </form>
    </>
  );

  return (
    <>
      <FloatingActionButton icon={Sparkles} label="Open AI Assistant" tone="ai" onClick={() => setOpen(true)} />
      {isDesktop ? (
        <Drawer open={open} onClose={() => setOpen(false)} side="right" width={400}>
          <div className="flex h-full flex-col">{content}</div>
        </Drawer>
      ) : (
        <Sheet open={open} onClose={() => setOpen(false)} maxHeight="88vh">
          <div className="flex h-[75vh] flex-col">{content}</div>
        </Sheet>
      )}
    </>
  );
}
