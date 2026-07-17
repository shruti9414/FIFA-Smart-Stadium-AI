"use client";

/**
 * Persistent atmosphere for the ENTIRE Fan Experience — fixed to the
 * viewport so it's visible no matter which section is scrolled into
 * view. Previously only the Home hero had any ambient treatment
 * (StadiumHeroAtmosphere), which is why every section below it read as
 * flat, empty black. This is the single highest-impact fix: it's what
 * makes the whole page feel like one continuous stadium environment
 * instead of a hero followed by bare panels.
 */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* base gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.09),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(16,185,129,0.07),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.08),transparent_55%)]" />

      {/* large slow-drifting glow blobs, fixed relative to viewport so they're always present */}
      <div className="absolute left-[8%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent-cyan/[0.07] blur-[130px] animate-drift-slow" />
      <div className="absolute right-[5%] top-[45%] h-[560px] w-[560px] rounded-full bg-accent-emerald/[0.06] blur-[140px] animate-drift-slower" />
      <div className="absolute bottom-[5%] left-[35%] h-[420px] w-[420px] rounded-full bg-accent-blue/[0.06] blur-[120px] animate-drift-slow" />

      {/* faint stadium ring silhouette, very large, centered, barely visible for depth */}
      <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 opacity-[0.025]">
        <ellipse cx="200" cy="200" rx="185" ry="185" fill="none" stroke="#22D3EE" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="140" ry="140" fill="none" stroke="#22D3EE" strokeWidth="1" />
      </svg>

      {/* scattered ambient particles across the full viewport height */}
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent-cyan/40 animate-float"
          style={{
            left: `${(i * 47) % 100}%`,
            top: `${(i * 31) % 100}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            animationDelay: `${(i % 8) * 0.5}s`,
            animationDuration: `${7 + (i % 6)}s`,
          }}
        />
      ))}

      <div className="scanlines absolute inset-0 opacity-[0.015]" />
      <div className="noise-overlay" />
    </div>
  );
}
