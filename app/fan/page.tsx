"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Home, Navigation, UtensilsCrossed, Trophy, Sparkles, Radio, Ticket } from "lucide-react";
import { BottomTabBar, type TabItem } from "@/components/shared/bottom-tab-bar";
import { AssistantLauncher } from "@/components/shared/assistant-launcher";
import { EmergencySheet } from "@/components/fan/emergency-sheet";
import { LiveNotificationStream } from "@/components/fan/live-notification-stream";
import { AmbientBackground } from "@/components/fan/ambient-background";
import { SectionShell } from "@/components/fan/section-shell";
import { DesktopSectionNav } from "@/components/fan/desktop-section-nav";
import { LiveWidgetsRow } from "@/components/fan/live-widgets-row";
import { TicketMatchBriefingRow } from "@/components/fan/ticket-match-briefing-row";
import { AISuggestionsSection } from "@/components/fan/ai-suggestions-section";
import { FanFooter } from "@/components/fan/fan-footer";
import { HomeTab, HeroSection } from "@/components/fan/home-tab";
import { NavigateTab } from "@/components/fan/navigate-tab";
import { AmenitiesTab } from "@/components/fan/amenities-tab";
import { MatchTab } from "@/components/fan/match-tab";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TABS: TabItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "navigate", label: "Navigate", icon: Navigation },
  { id: "amenities", label: "Amenities", icon: UtensilsCrossed },
  { id: "match", label: "Match", icon: Trophy },
];

function scrollToStadium() {
  document.getElementById("stadium")?.scrollIntoView({ behavior: "smooth" });
}

export default function FanExperiencePage() {
  const [activeTab, setActiveTab] = useState("home");
  const { isDesktop } = useBreakpoint();
  const reduced = useReducedMotion();
  const router = useRouter();

  const goToTab = (tab: string) => setActiveTab(tab);

  // "Home" in the nav always leaves /fan for the landing page — it's not an in-app tab destination.
  const onTabChange = (tab: string) => {
    if (tab === "home") {
      router.push("/");
      return;
    }
    setActiveTab(tab);
  };

  const onSwipe = (_: unknown, info: PanInfo) => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (info.offset.x < -60 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
    else if (info.offset.x > 60 && idx > 0) setActiveTab(TABS[idx - 1].id);
  };

  if (isDesktop) {
    // ===== Desktop: one continuous full-width scroll, Apple-product-page cadence =====
    return (
      <div className="flex flex-1 flex-col">
        <AmbientBackground />
        <DesktopSectionNav />

        <div id="hero">
          <HeroSection />
        </div>

        <SectionShell id="widgets" title="Live Stadium Status" subtitle="Updating in real time via Socket.io" icon={Radio}>
          <LiveWidgetsRow />
        </SectionShell>

        <SectionShell id="ticket" title="Your Match Day" subtitle="Ticket, live score, and today's top AI insight" icon={Ticket} alt>
          <TicketMatchBriefingRow />
        </SectionShell>

        <SectionShell id="stadium" title="Interactive Stadium Navigator" subtitle="Tap a zone or say your destination" icon={Navigation}>
          <NavigateTab showHeader={false} />
        </SectionShell>

        <SectionShell id="amenities" title="Amenities" subtitle="Food, parking, and transport — live availability" icon={UtensilsCrossed} alt>
          <AmenitiesTab onGetDirections={scrollToStadium} />
        </SectionShell>

        <SectionShell id="suggestions" title="AI Suggestions" subtitle="Proactive tips synthesized from live conditions" icon={Sparkles}>
          <AISuggestionsSection />
        </SectionShell>

        <SectionShell id="match" title="Match Center" subtitle="Live score, stats, and AI commentary" icon={Trophy} alt>
          <MatchTab />
        </SectionShell>

        <FanFooter />

        <LiveNotificationStream />
        <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
          <AssistantLauncher context="fan" />
          <EmergencySheet />
        </div>
      </div>
    );
  }

  // ===== Mobile: bottom-nav tab switching + swipe gesture =====
  return (
    <div className="flex flex-1 flex-col">
      <AmbientBackground />
      <div className="relative flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onSwipe}
            initial={{ opacity: 0, x: reduced ? 0 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {activeTab === "home" && <HomeTab onNavigateTab={goToTab} />}
            {activeTab === "navigate" && (
              <div className="px-4 py-4">
                <NavigateTab />
              </div>
            )}
            {activeTab === "amenities" && (
              <div className="px-4 py-4">
                <AmenitiesTab onGetDirections={() => goToTab("navigate")} />
              </div>
            )}
            {activeTab === "match" && (
              <div className="px-4 py-4">
                <MatchTab />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomTabBar tabs={TABS} active={activeTab} onChange={onTabChange} />

      <LiveNotificationStream />

      <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3">
        <AssistantLauncher context="fan" />
        <EmergencySheet />
      </div>
    </div>
  );
}
