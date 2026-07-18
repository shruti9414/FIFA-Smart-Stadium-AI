"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, Droplet, Trash2, Award, TrendingDown } from "lucide-react";
import { TopBar } from "@/components/shared/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { KPICard } from "@/components/shared/kpi-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { AIReasoningCard } from "@/components/shared/ai-reasoning-card";
import { fadeSlideUp, staggerChildren } from "@/lib/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function SustainabilityPage() {
  const reduced = useReducedMotion();

  const metrics = {
    carbonReduced: 1245,
    renewableEnergy: 78,
    waterSaved: 125000,
    wasteDiverted: 5230,
    energyEfficiency: 92,
    greenScore: 87,
  };

  return (
    <div className="flex flex-col min-h-screen bg-void">
      <TopBar title="Sustainability Operations" />

      <motion.div
        variants={staggerChildren(reduced, 60)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-4 sm:p-6"
      >
        <div className="mx-auto max-w-6xl space-y-6">
          {/* KPI Strip */}
          <motion.div variants={fadeSlideUp(reduced)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <GlassCard className="p-6">
              <KPICard
                icon={Leaf}
                label="Carbon Reduced (Match Day)"
                value={metrics.carbonReduced}
                suffix=" tons CO₂e"
                trend="down"
                trendLabel="vs. 2025"
              />
            </GlassCard>
            <GlassCard className="p-6">
              <KPICard
                icon={Zap}
                label="Renewable Energy"
                value={metrics.renewableEnergy}
                suffix="%"
                trend="up"
                trendLabel="+12% this month"
              />
            </GlassCard>
            <GlassCard className="p-6">
              <KPICard
                icon={Droplet}
                label="Water Saved (Gallons)"
                value={metrics.waterSaved}
                trend="up"
                trendLabel="vs. baseline"
              />
            </GlassCard>
            <GlassCard className="p-6">
              <KPICard
                icon={Trash2}
                label="Waste Diverted"
                value={metrics.wasteDiverted}
                suffix=" kg"
                trend="up"
                trendLabel="94% diversion"
              />
            </GlassCard>
            <GlassCard className="p-6">
              <KPICard
                icon={TrendingDown}
                label="Energy Efficiency"
                value={metrics.energyEfficiency}
                suffix="%"
                trend="up"
                trendLabel="Optimal"
              />
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-accent-emerald" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                    Overall Green Score
                  </span>
                </div>
                <div className="font-mono text-3xl font-semibold text-text-primary">
                  {metrics.greenScore}/100
                </div>
                <Badge className="w-fit bg-state-success/20 text-state-success">Certified Green Stadium</Badge>
              </div>
            </GlassCard>
          </motion.div>

          {/* Detailed Metrics */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
                Environmental Impact Breakdown
              </h2>

              <div className="space-y-6">
                {/* Carbon Footprint */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <Leaf size={18} className="text-state-success" />
                        Carbon Footprint Management
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Real-time emissions tracking from operations, transportation, and energy usage
                      </p>
                    </div>
                    <span className="font-mono text-2xl font-semibold text-state-success">↓ 42%</span>
                  </div>
                  <ProgressBar value={100 - 42} label="Reduction vs 2025" />
                </div>

                <Divider />

                {/* Renewable Energy */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <Zap size={18} className="text-accent-cyan" />
                        Renewable Energy Usage
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Solar panels (64%) + Grid renewable credits (14%) + On-site wind (22%)
                      </p>
                    </div>
                    <span className="font-mono text-2xl font-semibold text-accent-cyan">{metrics.renewableEnergy}%</span>
                  </div>
                  <ProgressBar value={metrics.renewableEnergy} label="Of total energy consumption" />
                </div>

                <Divider />

                {/* Water Conservation */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <Droplet size={18} className="text-accent-blue" />
                        Water Conservation
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Rainwater harvesting (45%) + Greywater recycling (35%) + Efficient fixtures (20%)
                      </p>
                    </div>
                    <span className="font-mono text-2xl font-semibold text-accent-blue">125K gal</span>
                  </div>
                  <ProgressBar value={80} label="Water saved vs. standard stadium" />
                </div>

                <Divider />

                {/* Waste Management */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <Trash2 size={18} className="text-accent-emerald" />
                        Waste Diversion Rate
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Recycling (60%) + Composting (25%) + Material Recovery (15%)
                      </p>
                    </div>
                    <span className="font-mono text-2xl font-semibold text-accent-emerald">94%</span>
                  </div>
                  <ProgressBar value={94} label="Waste diverted from landfills" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
                AI Sustainability Recommendations
              </h2>

              <div className="space-y-4">
                <AIReasoningCard
                  title="Energy Optimization"
                  icon={Zap}
                  affectedFacts={[
                    "HVAC currently operating at 87% efficiency",
                    "Peak solar generation: 11:00 AM - 2:00 PM (expected 450 kW)",
                    "Recommended: Shift non-critical loads to peak solar hours",
                    "Potential savings: 12-15 MWh per match day",
                  ]}
                  rationale="Real-time energy data shows opportunity for load shifting during peak renewable generation."
                  confidence={0.92}
                  generatedAt="2026-07-18T12:00:00Z"
                />

                <Divider />

                <AIReasoningCard
                  title="Water Efficiency"
                  icon={Droplet}
                  affectedFacts={[
                    "Restroom water usage: 85 gal/hour (above baseline)",
                    "Irrigation system can be optimized for current weather",
                    "Recommendation: Check for leaks in zone C and D",
                    "Potential savings: 8,000 gallons per event",
                  ]}
                  rationale="Sensor data indicates opportunity for water reduction through maintenance and scheduling."
                  confidence={0.87}
                  generatedAt="2026-07-18T12:00:00Z"
                />

                <Divider />

                <AIReasoningCard
                  title="Waste Reduction Strategy"
                  icon={Trash2}
                  affectedFacts={[
                    "Current diversion rate: 94% (excellent)",
                    "Food waste is primary remaining stream (6%)",
                    "Recommendation: Expand composting program to vendor stalls",
                    "Target: Achieve 97%+ diversion by next season",
                  ]}
                  rationale="Food waste analysis shows path to near-zero landfill operations through expanded composting."
                  confidence={0.89}
                  generatedAt="2026-07-18T12:00:00Z"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Certifications & Awards */}
          <motion.div variants={fadeSlideUp(reduced)}>
            <GlassCard className="p-6">
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
                Sustainability Certifications
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "ISO 14001", subtitle: "Environmental Management", status: "Certified" },
                  { name: "LEED Gold", subtitle: "Sustainable Building", status: "Certified" },
                  { name: "Green Stadium", subtitle: "FIFA Sustainability", status: "Certified" },
                  { name: "Carbon Neutral", subtitle: "2026 Match Events", status: "In Progress" },
                  { name: "Zero Waste", subtitle: "Target 2026", status: "On Track" },
                  { name: "Water Steward", subtitle: "Conservation Excellence", status: "Achieved" },
                ].map((cert, idx) => (
                  <div key={idx} className="rounded border border-border-subtle p-4 bg-surface/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">{cert.name}</h3>
                        <p className="text-xs text-text-secondary mt-1">{cert.subtitle}</p>
                      </div>
                      <Badge className={cert.status === "Certified" || cert.status === "Achieved" ? "bg-state-success/20 text-state-success" : "bg-accent-cyan/20 text-accent-cyan"}>
                        {cert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
