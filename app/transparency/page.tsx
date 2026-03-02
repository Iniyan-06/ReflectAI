import Link from "next/link";

const sections = [
    {
        icon: "✅",
        title: "What ReflectAI CAN do",
        items: [
            "Track your self-reported sleep, focus, stress, and journal entries over time.",
            "Compare your recent patterns to your own personal baseline.",
            "Show you gentle, plain-language observations about changes in your patterns.",
            "Display trend charts so you can see your own data visually.",
            "Provide links to crisis support resources if patterns shift significantly.",
        ],
    },
    {
        icon: "🚫",
        title: "What ReflectAI CANNOT do",
        items: [
            "Diagnose any mental health condition.",
            "Predict future mental health outcomes.",
            "Replace a licensed therapist, counsellor, or doctor.",
            "Provide clinical assessments or treatment recommendations.",
            "Monitor you without your active participation — it only knows what you tell it.",
        ],
    },
];

export default function TransparencyPage() {
    return (
        <div className="main-content" style={{ maxWidth: "680px" }}>
            {/* Header */}
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 700, fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                    How ReflectAI works
                </h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
                    Transparency is central to everything we do. This page explains exactly what this tool
                    does, how it works, and — importantly — what it cannot do.
                </p>
            </div>

            {/* Not a medical tool banner */}
            <div
                role="alert"
                aria-label="Important medical disclaimer"
                style={{
                    padding: "1.25rem 1.5rem",
                    background: "var(--color-accent-lt)",
                    borderRadius: "var(--radius-lg)",
                    borderLeft: "4px solid var(--color-accent)",
                    marginBottom: "2rem",
                    fontSize: "0.9375rem",
                }}
            >
                <strong>⚠️ ReflectAI is not a medical device or clinical tool.</strong>{" "}
                It cannot diagnose, treat, prevent, or cure any condition. It is a personal
                journaling and pattern-reflection aid only.
            </div>

            {/* Can / Cannot */}
            <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: "2rem" }}>
                {sections.map((s, si) => (
                    <div key={s.title} className={`card card--elevated animate-in delay-${(si + 1) * 100}`}>
                        <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
                            {s.icon} {s.title}
                        </h2>
                        <ul
                            style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}
                            role="list"
                        >
                            {s.items.map((item) => (
                                <li
                                    key={item}
                                    role="listitem"
                                    style={{ display: "flex", gap: "0.625rem", fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}
                                >
                                    <span aria-hidden="true" style={{ flexShrink: 0, color: si === 0 ? "#0891b2" : "#d97706", marginTop: "2px" }}>
                                        {si === 0 ? "✓" : "×"}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* How scoring works */}
            <div className="card card--elevated animate-in delay-200" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                    📐 How the scoring works (plain English)
                </h2>

                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem", lineHeight: 1.7 }}>
                    When you complete an onboarding setup, you tell ReflectAI your typical sleep, focus, and
                    stress levels. This becomes your <strong>personal baseline</strong>.
                </p>

                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem", lineHeight: 1.7 }}>
                    Each day you log a reflection, ReflectAI compares that day&rsquo;s values to your baseline.
                    It does this using a standard statistical measure called a <strong>z-score</strong> — essentially
                    "how far is today&rsquo;s value from my usual?" A z-score of 0 means exactly on-baseline;
                    higher numbers mean further away.
                </p>

                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                    Your journal text is analysed using a simple word-sentiment library (AFINN) that runs entirely
                    in your browser. It looks at the emotional tone of words — like "happy" or "tired" — and
                    produces a score. <strong>No text is ever sent to any server.</strong>
                </p>

                {/* Drift levels table */}
                <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.875rem" }}>
                    Drift levels explained
                </h3>
                <table
                    style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                    aria-label="Drift level descriptions"
                >
                    <thead>
                        <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                            <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0.75rem 0.5rem 0", color: "var(--color-text-muted)" }}>Level</th>
                            <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "var(--color-text-muted)" }}>What it means</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { level: "✅ Stable", badge: "drift-badge--stable", meaning: "Your patterns are close to your personal baseline." },
                            { level: "🔵 Mild Shift", badge: "drift-badge--mild", meaning: "Small variations — normal day-to-day fluctuation." },
                            { level: "🟡 Moderate Shift", badge: "drift-badge--moderate", meaning: "Noticeable change across multiple metrics or days." },
                            { level: "🔷 Significant Shift", badge: "drift-badge--significant", meaning: "Multiple patterns have shifted meaningfully. Consider a self-check-in." },
                        ].map((row) => (
                            <tr key={row.level} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "0.625rem 0.75rem 0.625rem 0", whiteSpace: "nowrap" }}>
                                    <span className={`drift-badge ${row.badge}`} style={{ fontSize: "0.75rem" }}>
                                        {row.level}
                                    </span>
                                </td>
                                <td style={{ padding: "0.625rem 0.75rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                                    {row.meaning}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem", marginTop: "1rem" }}>
                    <strong>Important:</strong> These levels are statistical observations, not clinical assessments.
                    A "Significant Shift" does not imply any clinical condition.
                </p>
            </div>

            {/* Limitations */}
            <div className="card animate-in delay-300" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>
                    ⚠️ Known limitations
                </h2>
                <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
                    <li>Results are only as accurate as the data you enter — be as honest as you can.</li>
                    <li>The sentiment model is simple and may misread sarcasm, humour, or non-English text.</li>
                    <li>Fewer than 3 log entries will produce low-confidence results.</li>
                    <li>This tool has no memory of context — it only sees numbers and sentiment scores, not the full meaning of your life.</li>
                    <li>Many things can cause pattern shifts (travel, illness, busy period) that have no wellness implication.</li>
                </ul>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/privacy" className="btn btn--secondary btn--sm">
                    Privacy & data →
                </Link>
                <Link href="/onboarding" className="btn btn--ghost btn--sm">
                    Start setup
                </Link>
            </div>
        </div>
    );
}
