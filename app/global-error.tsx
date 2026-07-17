"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070d",
          color: "#f8fafc",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            FIFA Smart Stadium AI hit an unexpected error
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 16 }}>Please try reloading the app.</p>
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(135deg, #22d3ee, #3b82f6, #10b981)",
              color: "#05070d",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
