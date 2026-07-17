"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Target, Flag, ShieldAlert, Volume2, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AIBadge } from "@/components/shared/ai-badge";
import { AIThinkingChip } from "@/components/shared/ai-thinking-chip";
import { StreamingText } from "@/components/shared/streaming-text";
import { PossessionBar } from "@/components/fan/possession-bar";
import { MomentumGraph } from "@/components/fan/momentum-graph";
import { ShotMap } from "@/components/fan/shot-map";
import { PlayerCard } from "@/components/fan/player-card";
import { GoalCelebration } from "@/components/fan/goal-celebration";
import { useMatch } from "@/hooks/useStadiumData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { seededRange } from "@/lib/utils/seededStats";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fallbackCommentary } from "@/lib/utils/aiFallback";
import type { MatchEventRow } from "@/lib/types/db";

const EVENT_LABEL: Record<string, string> = {
  goal: "⚽ Goal",
  yellow_card: "🟨 Yellow Card",
  red_card: "🟥 Red Card",
  substitution: "🔄 Substitution",
  var: "📺 VAR",
  kickoff: "Kickoff",
  halftime: "Half-time",
  fulltime: "Full-time",
};

export function MatchTab() {
  const reduced = useReducedMotion();
  const { match } = useMatch();
  const [events, setEvents] = useState<MatchEventRow[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryGeneratedAt, setSummaryGeneratedAt] = useState<string | null>(null);
  const [summaryFallback, setSummaryFallback] = useState(false);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [sessionToken] = useLocalStorage("assistant-session-fan", () => crypto.randomUUID());
  const [showGoal, setShowGoal] = useState(false);
  const prevEventCount = useRef<number | null>(null);

  useEffect(() => {
    if (!match) return;
    fetch(`/api/matches/${match.id}`)
      .then((r) => r.json())
      .then((json) => {
        const newEvents: MatchEventRow[] = json.data.events ?? [];
        if (prevEventCount.current !== null && newEvents.length > prevEventCount.current) {
          const latest = newEvents[newEvents.length - 1];
          if (latest?.event_type === "goal") {
            setShowGoal(true);
            setTimeout(() => setShowGoal(false), 1400);
          }
        }
        prevEventCount.current = newEvents.length;
        setEvents(newEvents);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id, match?.minute]);

  useEffect(() => {
    if (!match) return;
    fetch("/api/ai/match-summary")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        setSummary(json.data.summary);
        setSummaryGeneratedAt(json.meta.generatedAt);
        setSummaryFallback(false);
      })
      .catch(() => {
        const scorers = events.filter((e) => e.event_type === "goal").map((e) => `${e.player} (${e.minute}')`).join(", ");
        setSummary(
          `${match.home_team} and ${match.away_team} are currently level at ${match.home_score}-${match.away_score}` +
            (scorers ? `, with goals from ${scorers}.` : ".") +
            " A competitive match with chances at both ends."
        );
        setSummaryGeneratedAt(null);
        setSummaryFallback(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id, events.length]);

  useEffect(() => {
    if (!match) return;
    fetch("/api/ai/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken,
        context: "fan",
        language: "en",
        message: "Give a punchy one-sentence live commentary line for the current match moment, broadcast-announcer style. No greeting.",
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => setCommentary(json.data.reply))
      .catch(() => setCommentary(fallbackCommentary()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id, match?.minute]);

  if (!match) return null;

  const goalScorers = events.filter((e) => e.event_type === "goal");
  const stats = {
    shotsHome: Math.round(seededRange(`${match.id}-shH`, 4, 14)),
    shotsAway: Math.round(seededRange(`${match.id}-shA`, 4, 14)),
    cornersHome: Math.round(seededRange(`${match.id}-coH`, 1, 8)),
    cornersAway: Math.round(seededRange(`${match.id}-coA`, 1, 8)),
    foulsHome: Math.round(seededRange(`${match.id}-foH`, 3, 12)),
    foulsAway: Math.round(seededRange(`${match.id}-foA`, 3, 12)),
  };
  const xgHome = seededRange(`${match.id}-xgH`, 0.4, 2.8);
  const xgAway = seededRange(`${match.id}-xgA`, 0.4, 2.8);
  const crowdNoise = Math.round(seededRange(`${match.id}-noise-${Math.floor(match.minute / 5)}`, 55, 98));

  return (
    <motion.div variants={staggerChildren(reduced)} initial="hidden" animate="visible" className="space-y-4">
      {/* Hero scoreboard */}
      <motion.div variants={fadeSlideUp(reduced)} className="relative">
        <GlassCard elevation="L2" padding="lg" className="relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-cyan/[0.08] to-transparent" />
          <GoalCelebration show={showGoal} />
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">{match.stage}</p>
          <div className="mt-2 flex items-center justify-center gap-5">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-emphasis bg-glass-elevated font-display text-xs font-bold">
                {match.home_team.slice(0, 3).toUpperCase()}
              </div>
              <span className="max-w-[70px] truncate text-[11px] text-text-secondary">{match.home_team}</span>
            </div>
            <motion.span
              key={`${match.home_score}-${match.away_score}`}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-mono text-4xl font-bold tabular-nums text-text-primary"
            >
              {match.home_score}-{match.away_score}
            </motion.span>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-emphasis bg-glass-elevated font-display text-xs font-bold">
                {match.away_team.slice(0, 3).toUpperCase()}
              </div>
              <span className="max-w-[70px] truncate text-[11px] text-text-secondary">{match.away_team}</span>
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-accent-cyan">{match.status === "live" ? `● LIVE — ${match.minute}'` : match.status}</p>

          {commentary && (
            <div className="mx-auto mt-3 flex max-w-sm items-start gap-2 rounded-sm bg-glass px-3 py-2 text-left">
              <Mic size={13} className="mt-0.5 shrink-0 text-accent-cyan" />
              <p className="text-xs italic text-text-secondary">
                <StreamingText text={commentary} />
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Possession + momentum + crowd noise */}
      <motion.div variants={fadeSlideUp(reduced)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard padding="md">
          <PossessionBar seedKey={`match-${match.id}`} homeTeam={match.home_team} awayTeam={match.away_team} />
        </GlassCard>
        <GlassCard padding="md">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-text-muted">Momentum</p>
          <MomentumGraph seedKey={`match-${match.id}`} currentMinute={match.minute} />
        </GlassCard>
        <GlassCard padding="md" className="flex flex-col justify-center gap-2">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-muted">
            <Volume2 size={12} />
            Crowd Noise
          </p>
          <div className="flex items-end gap-0.5 h-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t-sm bg-accent-cyan/70"
                animate={{ height: `${Math.max(15, (crowdNoise + ((i * 13) % 20) - 10) % 100)}%` }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
              />
            ))}
          </div>
          <p className="font-mono text-xs text-accent-cyan">{crowdNoise} dB</p>
        </GlassCard>
      </motion.div>

      {/* Shot map + stats + xG */}
      <motion.div variants={fadeSlideUp(reduced)} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard padding="md" className="lg:col-span-1">
          <p className="mb-2 text-[10px] uppercase tracking-wide text-text-muted">Shot Map</p>
          <ShotMap events={events} homeTeam={match.home_team} />
        </GlassCard>
        <GlassCard padding="md" className="space-y-2.5">
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Match Statistics</p>
          <StatRow icon={Target} label="Shots" home={stats.shotsHome} away={stats.shotsAway} />
          <StatRow icon={Flag} label="Corners" home={stats.cornersHome} away={stats.cornersAway} />
          <StatRow icon={ShieldAlert} label="Fouls" home={stats.foulsHome} away={stats.foulsAway} />
        </GlassCard>
        <GlassCard padding="md" className="space-y-2.5">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-muted">
            <TrendingUp size={12} />
            Expected Goals (xG)
          </p>
          <div className="flex items-center justify-between font-mono text-lg font-semibold">
            <span className="text-accent-cyan">{xgHome.toFixed(2)}</span>
            <span className="text-xs text-text-muted">vs</span>
            <span className="text-accent-emerald">{xgAway.toFixed(2)}</span>
          </div>
          <p className="text-xs text-text-secondary">Illustrative — based on shot volume and match state.</p>
        </GlassCard>
      </motion.div>

      {/* Goal scorers */}
      {goalScorers.length > 0 && (
        <motion.div variants={fadeSlideUp(reduced)}>
          <p className="mb-2 text-[10px] uppercase tracking-wide text-text-muted">Goal Scorers</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {goalScorers.map((e) => (
              <PlayerCard key={e.id} name={e.player ?? "Unknown"} team={e.team ?? ""} minute={e.minute} />
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Summary */}
      <motion.div variants={fadeSlideUp(reduced)}>
        <GlassCard padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <AIBadge cached={Boolean(summaryGeneratedAt) && !summaryFallback} />
          </div>
          {summary ? (
            <p className="text-sm leading-relaxed text-text-primary">
              <StreamingText text={summary} />
            </p>
          ) : (
            <AIThinkingChip label="Gemini is writing the recap..." />
          )}
        </GlassCard>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={fadeSlideUp(reduced)}>
        <GlassCard padding="md">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">Timeline</h3>
          <ol className="space-y-2.5">
            {events.map((e) => (
              <li key={e.id} className="flex items-start gap-3 text-sm">
                <span className="w-8 shrink-0 font-mono text-xs text-accent-cyan">{e.minute}&apos;</span>
                <div>
                  <span className="text-text-primary">{EVENT_LABEL[e.event_type] ?? e.event_type}</span>
                  {e.team && <span className="text-text-secondary"> — {e.team}{e.player ? ` (${e.player})` : ""}</span>}
                  {e.detail && <p className="text-xs text-text-muted">{e.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function StatRow({ icon: Icon, label, home, away }: { icon: typeof Target; label: string; home: number; away: number }) {
  const total = home + away || 1;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-text-primary">{home}</span>
        <span className="flex items-center gap-1 text-[10px] uppercase text-text-muted">
          <Icon size={10} />
          {label}
        </span>
        <span className="text-text-primary">{away}</span>
      </div>
      <div className="flex h-1 overflow-hidden rounded-full bg-glass-elevated">
        <div className="h-full bg-accent-cyan" style={{ width: `${(home / total) * 100}%` }} />
        <div className="h-full bg-accent-emerald" style={{ width: `${(away / total) * 100}%` }} />
      </div>
    </div>
  );
}
