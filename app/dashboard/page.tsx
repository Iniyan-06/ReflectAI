"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts";
import { getAllEntries, getBaseline, BaselineProfile, DailyEntry } from "@/lib/storage";

interface ChartPoint {
    date: string;
    sleep: number;
    focus: number;
    stress: number;
    sentiment: number;
}

type MetricKey = "sleep" | "focus" | "stress" | "sentiment";

const METRICS: { key: MetricKey; label: string; color: string; baselineKey: keyof BaselineProfile | null; unit: string }[] = [
    { key: "sleep", label: "😴 Sleep (hrs)", color: "#0891b2", baselineKey: "sleepHours", unit: "hrs" },
    { key: "focus", label: "🎯 Focus time (hrs)", color: "#2563eb", baselineKey: "focusHours", unit: "hrs" },
    { key: "stress", label: "📊 Stress level", color: "#d97706", baselineKey: "stressLevel", unit: "/5" },
    { key: "sentiment", label: "📝 Journal tone", color: "#7c3aed", baselineKey: null, unit: "" },
];

function MetricChart({
    data,
    metricKey,
    label,
    color,
    baselineValue,
    unit,
}: {
    data: ChartPoint[];
    metricKey: MetricKey;
    label: string;
    color: string;
    baselineValue?: number;
    unit: string;
}) {
    return (
        <div
            className="card animate-in"
            style={{ marginBottom: "1.25rem" }}
            role="region"
            aria-label={`${label} trend chart`}
        >
            <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "1rem" }}>{label}</h3>
            {data.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
                    No data yet. Start logging daily reflections.
                </p>
            ) : (
                <div className="chart-container" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                                tickFormatter={(v) => v.slice(5)} // show MM-DD
                            />
                            <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid var(--color-border)",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "0.875rem",
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={(v: any) => [`${Number(v).toFixed(1)}${unit}`, label.replace(/^[^ ]+ /, "")]}
                            />
                            {baselineValue !== undefined && (
                                <ReferenceLine
                                    y={baselineValue}
                                    stroke={color}
                                    strokeDasharray="6 3"
                                    strokeOpacity={0.5}
                                    label={{ value: "baseline", position: "insideTopRight", fontSize: 10, fill: color }}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey={metricKey}
                                stroke={color}
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: color, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [baseline, setBaseline] = useState<BaselineProfile | null>(null);

    useEffect(() => {
        async function load() {
            const [b, entries] = await Promise.all([getBaseline(), getAllEntries()]);
            setBaseline(b ?? null);

            const recent: DailyEntry[] = entries.slice(-14); // last 14 days
            const points: ChartPoint[] = recent.map((e) => ({
                date: e.date,
                sleep: e.sleepHours,
                focus: e.focusHours,
                stress: e.stressLevel,
                sentiment: parseFloat(e.sentimentScore.toFixed(2)),
            }));
            setChartData(points);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="main-content" style={{ textAlign: "center", paddingTop: "4rem" }}>
                <p style={{ color: "var(--color-text-muted)" }} role="status" aria-live="polite">
                    Loading dashboard…
                </p>
            </div>
        );
    }

    return (
        <div className="main-content" style={{ maxWidth: "720px" }}>
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 700, fontSize: "1.625rem", marginBottom: "0.5rem" }}>
                    Your trends
                </h1>
                <p style={{ color: "var(--color-text-muted)" }}>
                    14-day view of your daily reflections. Dashed lines show your personal baseline.
                    {" "}
                    {chartData.length === 0 && "Log some reflections to see data here."}
                </p>
            </div>

            {METRICS.map((m) => (
                <MetricChart
                    key={m.key}
                    data={chartData}
                    metricKey={m.key}
                    label={m.label}
                    color={m.color}
                    baselineValue={
                        baseline && m.baselineKey
                            ? (baseline[m.baselineKey] as number)
                            : undefined
                    }
                    unit={m.unit}
                />
            ))}

            {/* No diagnosis disclaimer */}
            <div
                role="note"
                aria-label="Chart interpretation note"
                style={{
                    padding: "1rem 1.25rem",
                    background: "var(--color-accent-lt)",
                    borderRadius: "var(--radius-lg)",
                    borderLeft: "4px solid var(--color-accent)",
                    marginBottom: "1.5rem",
                    fontSize: "0.875rem",
                }}
            >
                <strong>How to read these charts:</strong> Fluctuations are normal and expected. These trends are
                personal observations, not medical measurements. For professional support, please consult a qualified
                practitioner.
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/reflect" className="btn btn--primary btn--sm">
                    + Add today&rsquo;s reflection
                </Link>
                <Link href="/insights" className="btn btn--ghost btn--sm">
                    View insights
                </Link>
            </div>
        </div>
    );
}
