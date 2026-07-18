import { Hero } from "@/components/landing/hero";
import { LiveActivityFeed } from "@/components/landing/live-activity-feed";
import { DigitalTwinPreview } from "@/components/landing/digital-twin-preview";
import { CoreFeatures } from "@/components/landing/core-features";
import { WhyStadiumOS } from "@/components/landing/why-stadium-os";
import { ChooseExperience } from "@/components/landing/choose-experience";
import { InstallPWASection } from "@/components/landing/install-pwa-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <LiveActivityFeed />
      <DigitalTwinPreview />
      <CoreFeatures />
      <WhyStadiumOS />
      <ChooseExperience />
      <InstallPWASection />
      <Footer />
    </main>
  );
}
