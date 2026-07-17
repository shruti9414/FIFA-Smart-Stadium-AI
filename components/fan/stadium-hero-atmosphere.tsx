"use client";

/**
 * "Inside the stadium at night" atmosphere for the Fan Home hero — a
 * lighter sibling of the landing page's HeroAtmosphere (fewer layers, no
 * neural network) since this remounts every time a fan revisits the
 * Home tab and needs to stay cheap.
 */
export function StadiumHeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(34,211,238,0.14),transparent_60%),radial-gradient(ellipse_at_20%_100%,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(59,130,246,0.10),transparent_55%)]" />

      {/* floodlight beams from the top corners, stadium-at-night read */}
      <div
        className="absolute -top-10 left-[8%] h-[420px] w-[140px] origin-top animate-beam-sweep"
        style={{ background: "linear-gradient(to bottom, rgba(34,211,238,0.16), transparent 75%)", filter: "blur(24px)" }}
      />
      <div
        className="absolute -top-10 right-[10%] h-[420px] w-[140px] origin-top animate-beam-sweep"
        style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.12), transparent 75%)", filter: "blur(24px)", animationDelay: "-4s" }}
      />

      <div className="absolute -bottom-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-accent-cyan/10 blur-[100px] animate-drift-slow" />

      {/* faint stadium-ring silhouette for depth */}
      <svg viewBox="0 0 400 300" className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-[0.08]" preserveAspectRatio="xMidYMax slice">
        <ellipse cx="200" cy="320" rx="260" ry="90" fill="none" stroke="#22D3EE" strokeWidth="2" />
        <ellipse cx="200" cy="320" rx="190" ry="65" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
      </svg>

      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent-cyan/50 animate-float"
          style={{
            left: `${(i * 41) % 100}%`,
            top: `${(i * 29) % 70}%`,
            width: i % 2 === 0 ? 2 : 3,
            height: i % 2 === 0 ? 2 : 3,
            animationDelay: `${(i % 5) * 0.7}s`,
            animationDuration: `${7 + (i % 4)}s`,
          }}
        />
      ))}

      <div className="noise-overlay" />
    </div>
  );
}
