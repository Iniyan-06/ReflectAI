"use client";

import { useState } from "react";
import Link from "next/link";
import { exportAllData, deleteAllData } from "@/lib/storage";

export default function PrivacyPage() {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleted, setDeleted] = useState(false);

    async function handleExport() {
        const json = await exportAllData();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reflectai-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async function handleDelete() {
        await deleteAllData();
        setDeleted(true);
        setDeleteConfirm(false);
    }

    return (
        <div className="main-content" style={{ maxWidth: "680px" }}>
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 700, fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                    Privacy & your data
                </h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
                    ReflectAI is built around one principle: <strong>your data belongs to you</strong>.
                    Here&rsquo;s exactly how it&rsquo;s handled.
                </p>
            </div>

            {/* Storage model */}
            <div className="card card--elevated animate-in delay-100" style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                    🔒 Where your data lives
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                        {
                            icon: "💾",
                            title: "IndexedDB (your browser)",
                            desc: "All your data — baseline, daily entries, trusted contact — is stored in your browser's local IndexedDB. No account, no cloud, no server.",
                        },
                        {
                            icon: "🚫",
                            title: "No network calls for your data",
                            desc: "ReflectAI never sends your journal text, sleep hours, or any personal data over the internet. Zero analytics SDKs, zero tracking pixels.",
                        },
                        {
                            icon: "📱",
                            title: "Device-bound",
                            desc: "Your data does not sync across devices. If you clear your browser storage, the data is gone. Export below to keep a copy.",
                        },
                        {
                            icon: "🔐",
                            title: "Browser-level encryption",
                            desc: "IndexedDB data is protected by your browser and OS security model. For additional protection, use device encryption (e.g. FileVault, BitLocker).",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            style={{
                                display: "flex",
                                gap: "1rem",
                                padding: "1rem",
                                background: "var(--color-bg)",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--color-border)",
                            }}
                        >
                            <span style={{ fontSize: "1.5rem", flexShrink: 0 }} aria-hidden="true">{item.icon}</span>
                            <div>
                                <strong style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9375rem" }}>
                                    {item.title}
                                </strong>
                                <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data minimisation */}
            <div className="card animate-in delay-200" style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>
                    📋 What we collect and why
                </h2>
                <table
                    style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                    aria-label="Data collected by ReflectAI"
                >
                    <thead>
                        <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                            <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0.75rem 0.5rem 0", color: "var(--color-text-muted)" }}>Data point</th>
                            <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "var(--color-text-muted)" }}>Why</th>
                            <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "var(--color-text-muted)" }}>Where stored</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { data: "Sleep hours", why: "Baseline & daily tracking", where: "Local only" },
                            { data: "Focus hours", why: "Baseline & daily tracking", where: "Local only" },
                            { data: "Stress level", why: "Drift calculation", where: "Local only" },
                            { data: "Journal text", why: "Sentiment analysis", where: "Local only — never transmitted" },
                            { data: "Sentiment score", why: "Stored number, not the text", where: "Local only" },
                            { data: "Social level", why: "Context for patterns", where: "Local only" },
                            { data: "Trusted contact", why: "Optional user-initiated", where: "Local only" },
                        ].map((row) => (
                            <tr key={row.data} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", fontWeight: 500 }}>{row.data}</td>
                                <td style={{ padding: "0.5rem 0.75rem", color: "var(--color-text-muted)" }}>{row.why}</td>
                                <td style={{ padding: "0.5rem 0.75rem", color: "var(--color-safe)", fontWeight: 500 }}>{row.where}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* What we DON'T collect */}
            <div className="card animate-in delay-200" style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>
                    🙅 What we never collect
                </h2>
                <ul
                    style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}
                    role="list"
                >
                    {[
                        "Your name, email, or any identifying information",
                        "Location data",
                        "Keystroke patterns or typing speed",
                        "Browsing history or cross-site tracking",
                        "Background data while you're not using the app",
                        "Device identifiers or fingerprinting",
                    ].map((item) => (
                        <li
                            key={item}
                            role="listitem"
                            style={{ display: "flex", gap: "0.625rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}
                        >
                            <span style={{ color: "#b91c1c", flexShrink: 0 }} aria-hidden="true">✕</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Data management */}
            <div className="card animate-in delay-300" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                    ⚙️ Manage your data
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Export */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                            <strong style={{ display: "block", fontSize: "0.9375rem" }}>Export all data</strong>
                            <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                                Download everything as a JSON file for your own records.
                            </span>
                        </div>
                        <button className="btn btn--secondary btn--sm" onClick={handleExport}>
                            Export JSON
                        </button>
                    </div>

                    <div className="divider" />

                    {/* Delete */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                            <strong style={{ display: "block", fontSize: "0.9375rem" }}>Delete all data</strong>
                            <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                                Permanently remove everything from this device. This cannot be undone.
                            </span>
                        </div>
                        {deleted ? (
                            <p style={{ color: "#0e7490", fontWeight: 500, fontSize: "0.9rem" }}>✓ All data deleted.</p>
                        ) : deleteConfirm ? (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn btn--danger btn--sm" onClick={handleDelete}>
                                    Yes, delete
                                </button>
                                <button className="btn btn--ghost btn--sm" onClick={() => setDeleteConfirm(false)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn--ghost btn--sm"
                                onClick={() => setDeleteConfirm(true)}
                                aria-label="Delete all personal data from this device"
                            >
                                Delete data
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/transparency" className="btn btn--ghost btn--sm">
                    ← How it works
                </Link>
            </div>
        </div>
    );
}
