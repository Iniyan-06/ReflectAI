"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBaseline, getRecentEntries, BaselineProfile, DailyEntry } from "@/lib/storage";
import { computeDrift, DriftResult } from "@/lib/driftEngine";
import CrisisSafeguard from "@/components/CrisisSafeguard";

/** SVG ring showing stability score */
function StabilityRing({ score }: { score: number }) {
    const size = 140;
    const r = 54;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - score / 100);

    const color =
        score >= 75 ? "#0891b2" : score >= 50 ? "#2563eb" : score >= 30 ? "#d97706" : "#1e40af";

    return (
        <div
            className="stability-ring"
            aria-label={`Stability score: ${score} out of 100`}
            role="img"
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
                {/* Background ring */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border)" strokeWidth={10} />
                {/* Progress ring */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={10}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
            </svg>
            {/* Label */}
            <div className="stability-ring__label">
                <div style={{ fontSize: "1.875rem", fontWeight: 700, color }}>{score}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: 500 }}>STABILITY</div>
            </div>
        </div>
    );
}

const DRIFT_CLASS: Record<string, string> = {
    "Stable": "drift-badge--stable",
    "Mild Shift": "drift-badge--mild",
    "Moderate Shift": "drift-badge--moderate",
    "Significant Shift": "drift-badge--significant",
};

const DRIFT_ICON: Record<string, string> = {
    "Stable": "✅",
    "Mild Shift": "🔵",
    "Moderate Shift": "🟡",
    "Significant Shift": "🔷",
};

export default function InsightsPage() {
    const [loading, setLoading] = useState(true);
    const [noBaseline, setNoBaseline] = useState(false);
    const [baseline, setBaseline] = useState<BaselineProfile | null>(null);
    const [entries, setEntries] = useState<DailyEntry[]>([]);
    const [result, setResult] = useState<DriftResult | null>(null);

    useEffect(() => {
        async function load() {
            const [b, e] = await Promise.all([getBaseline(), getRecentEntries(7)]);
            if (!b) { setNoBaseline(true); setLoading(false); return; }
            setBaseline(b);
            setEntries(e);
            setResult(computeDrift(b, e));
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="main-content" style={{ textAlign: "center", paddingTop: "4rem" }}>
                <p style={{ color: "var(--color-text-muted)" }} role="status" aria-live="polite">
                    Loading your insights…
                </p>
            </div>
        );
    }

    if (noBaseline) {
        return (
            <div className="main-content" style={{ maxWidth: "560px", textAlign: "center", paddingTop: "3rem" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }} aria-hidden="true">🌱</div>
                <h1 style={{ fontWeight: 700, marginBottom: "1rem" }}>Set up your baseline first</h1>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    Your insights will appear here after you complete the onboarding and log at least one daily reflection.
                </p>
                <Link href="/onboarding" className="btn btn--primary">Go to setup →</Link>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="main-content" style={{ maxWidth: "620px" }}>
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 700, fontSize: "1.625rem", marginBottom: "0.5rem" }}>Your reflection insights</h1>
                <p style={{ color: "var(--color-text-muted)" }}>
                    Based on {entries.length} day{entries.length !== 1 ? "s" : ""} of data.
                    Confidence: <strong>{result.confidence}</strong>
                </p>
            </div>

            {/* Score row */}
            <div
                className="card card--elevated animate-in delay-100"
                style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1.25rem", flexWrap: "wrap" }}
            >
                <StabilityRing score={result.stabilityScore} />
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                        <span
                            className={`drift-badge ${DRIFT_CLASS[result.driftLevel]}`}
                            role="status"
                            aria-label={`Pattern status: ${result.driftLevel}`}
                        >
                            <span aria-hidden="true">{DRIFT_ICON[result.driftLevel]}</span>
                            {result.driftLevel}
                        </span>
                    </div>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                        {result.driftLevel === "Stable" &&
                            "Your patterns are consistent with your baseline. Keep it up!"}
                        {result.driftLevel === "Mild Shift" &&
                            "Minor variations detected. This is normal — life has rhythms."}
                        {result.driftLevel === "Moderate Shift" &&
                            "Some noticeable changes in your patterns this week. Take a moment to reflect."}
                        {result.driftLevel === "Significant Shift" &&
                            "Several of your patterns have shifted meaningfully. It may be worth checking in with yourself."}
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                        Note: This is a personal reflection tool, not a medical assessment.
                    </p>
                </div>
            </div>

            {/* Goal reminder */}
            {baseline?.goalStatement && (
                <div
                    className="animate-in delay-100"
                    style={{
                        padding: "1rem 1.25rem",
                        background: "var(--color-primary-lt)",
                        borderRadius: "var(--radius-lg)",
                        marginBottom: "1.25rem",
                        borderLeft: "4px solid var(--color-primary)",
                    }}
                    role="note"
                    aria-label="Your personal intention"
                >
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.25rem" }}>
                        Your intention
                    </span>
                    <p style={{ color: "var(--color-text)", fontSize: "0.9375rem", fontStyle: "italic" }}>
                        &ldquo;{baseline.goalStatement}&rdquo;
                    </p>
                </div>
            )}

            {/* Insight cards */}
            <section aria-labelledby="insights-heading" style={{ marginBottom: "1.5rem" }}>
                <h2
                    id="insights-heading"
                    style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}
                >
                    Gentle observations
                </h2>
                <div
                    role="list"
                    aria-label="Personal insights"
                    style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
                >
                    {result.insights.map((insight, i) => (
                        <div
                            key={i}
                            className={`insight-card animate-in delay-${i < 3 ? (i + 1) * 100 : 300}`}
                            role="listitem"
                        >
                            <span style={{ fontSize: "1.375rem", flexShrink: 0 }} aria-hidden="true">
                                {i === 0 ? "💤" : i === 1 ? "🎯" : i === 2 ? "📝" : "📊"}
                            </span>
                            <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{insight}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reflection prompt */}
            <div
                className="animate-in delay-200"
                style={{
                    padding: "1.25rem",
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-border)",
                    marginBottom: "1.5rem",
                    textAlign: "center",
                }}
                role="complementary"
                aria-label="Reflection prompt"
            >
                <p style={{ fontStyle: "italic", color: "var(--color-text-muted)", marginBottom: "0.875rem" }}>
                    Would you like to reflect on what may have changed?
                </p>
                <Link href="/reflect" className="btn btn--secondary btn--sm">
                    Add today&rsquo;s reflection
                </Link>
            </div>

            {/* Crisis safeguard — only when warranted */}
            {result.showCrisisSafeguard && (
                <div style={{ marginBottom: "1.5rem" }}>
                    <CrisisSafeguard />
                </div>
            )}

            {/* Metric breakdown */}
            <details
                className="animate-in delay-300"
                style={{
                    padding: "1.25rem",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    marginBottom: "1.5rem",
                }}
            >
                <summary
                    style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9375rem", userSelect: "none" }}
                    aria-label="Show metric details"
                >
                    How was this calculated?
                </summary>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                        Each metric is compared to your personal baseline using a statistical measure called a z-score.
                        Higher deviations move your Stability Score lower. See{" "}
                        <Link href="/transparency" style={{ color: "var(--color-primary)" }}>How It Works</Link> for details.
                    </p>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                        aria-label="Metric deviation table"
                    >
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <th style={{ textAlign: "left", padding: "0.5rem 0", color: "var(--color-text-muted)" }}>Metric</th>
                                <th style={{ textAlign: "right", padding: "0.5rem 0", color: "var(--color-text-muted)" }}>Deviation (z)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: "😴 Sleep", z: result.metrics.sleepDeviation },
                                { label: "🎯 Focus", z: result.metrics.focusDeviation },
                                { label: "📊 Stress", z: result.metrics.stressDeviation },
                                { label: "📝 Journal tone", z: result.metrics.sentimentDeviation },
                            ].map((m) => (
                                <tr key={m.label} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    <td style={{ padding: "0.5rem 0" }}>{m.label}</td>
                                    <td style={{ textAlign: "right", padding: "0.5rem 0", fontFamily: "monospace" }}>
                                        {m.z > 0 ? "+" : ""}{m.z}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>

            <div style={{ textAlign: "center" }}>
                <Link href="/dashboard" className="btn btn--ghost btn--sm">
                    View 7-day trends →
                </Link>
            </div>
        </div>
    );
}
