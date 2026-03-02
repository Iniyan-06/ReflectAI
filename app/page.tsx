import Link from "next/link";

const principles = [
  { icon: "🔒", title: "Privacy First", desc: "All data stays on your device. Nothing is sent to any server." },
  { icon: "💚", title: "Do No Harm", desc: "Gentle reflections only. No alarms, no clinical labels, no pressure." },
  { icon: "🎯", title: "Be Honest", desc: "This is not a medical tool. We're clear about what we can and cannot do." },
  { icon: "♿", title: "Accessible", desc: "Designed for everyone — clear language, high contrast, screen-reader friendly." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">
          Notice the small shifts.<br />
          <em style={{ fontStyle: "normal", opacity: 0.85 }}>Before they become big ones.</em>
        </h1>
        <p style={{ marginBottom: "2rem" }}>
          ReflectAI is a private, gentle journaling companion that helps you track subtle
          changes in sleep, focus, and mood — with no diagnosis and no data leaving your device.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/onboarding" className="btn btn--primary btn--lg" style={{ color: "white" }}>
            Get started →
          </Link>
          <Link href="/transparency" className="btn btn--ghost btn--lg" style={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}>
            How it works
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section
        className="main-content"
        aria-labelledby="principles-heading"
        style={{ maxWidth: "960px" }}
      >
        <h2
          id="principles-heading"
          style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}
        >
          Built on core principles
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
          role="list"
          aria-label="Core principles"
        >
          {principles.map((p, i) => (
            <div
              key={p.title}
              className={`card animate-in delay-${i === 0 ? "100" : i === 1 ? "200" : i === 2 ? "300" : "300"}`}
              role="listitem"
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }} aria-hidden="true">
                {p.icon}
              </div>
              <h3 style={{ fontWeight: 650, marginBottom: "0.5rem", fontSize: "1rem" }}>{p.title}</h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* What it tracks */}
        <div className="card card--elevated animate-in delay-200" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "1.25rem" }}>
            What ReflectAI tracks
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
            role="list"
            aria-label="Tracked metrics"
          >
            {[
              { icon: "😴", label: "Sleep patterns", sub: "Hours & consistency" },
              { icon: "🎯", label: "Focus time", sub: "Daily productive hours" },
              { icon: "📝", label: "Mood journaling", sub: "Sentiment in writing" },
              { icon: "📊", label: "Routine stability", sub: "Stress & social levels" },
            ].map((m) => (
              <div
                key={m.label}
                role="listitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "1rem",
                  background: "var(--color-bg)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span style={{ fontSize: "1.75rem" }} aria-hidden="true">{m.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{m.label}</div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          role="note"
          aria-label="Important disclaimer"
          style={{
            padding: "1.25rem 1.5rem",
            background: "var(--color-accent-lt)",
            borderRadius: "var(--radius-lg)",
            borderLeft: "4px solid var(--color-accent)",
            marginBottom: "2rem",
          }}
        >
          <strong>This tool is not a medical device.</strong>{" "}
          It cannot diagnose, treat, or predict any mental health condition.
          If you have concerns about your wellbeing, please speak with a qualified professional.
          {" "}
          <Link href="/transparency" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
            Read our full transparency statement →
          </Link>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/onboarding" className="btn btn--primary btn--lg">
            Start your reflection journey →
          </Link>
        </div>
      </section>
    </>
  );
}
