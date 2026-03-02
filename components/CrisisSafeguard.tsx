"use client";

import { useState } from "react";
import { saveTrustedContact, TrustedContact } from "@/lib/storage";

const HOTLINES = [
    { country: "🌍 International", name: "Befrienders Worldwide", number: "befrienders.org" },
    { country: "🇺🇸 USA", name: "Crisis Text Line", number: "Text HOME to 741741" },
    { country: "🇺🇸 USA", name: "988 Suicide & Crisis Lifeline", number: "988" },
    { country: "🇬🇧 UK", name: "Samaritans", number: "116 123" },
    { country: "🇮🇳 India", name: "iCall", number: "9152987821" },
    { country: "🇦🇺 Australia", name: "Lifeline", number: "13 11 14" },
    { country: "🇨🇦 Canada", name: "Crisis Services Canada", number: "1-833-456-4566" },
    { country: "🇩🇪 Germany", name: "Telefonseelsorge", number: "0800 111 0 111" },
];

export default function CrisisSafeguard() {
    const [showContactForm, setShowContactForm] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "" });

    async function handleSaveContact(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name) return;
        await saveTrustedContact(form);
        setSaved(true);
        setShowContactForm(false);
    }

    return (
        <section
            className="crisis-box animate-in"
            role="region"
            aria-label="Support resources"
            aria-live="polite"
        >
            {/* Non-alarming heading */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "2rem" }} aria-hidden="true">💙</span>
                <div>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.375rem" }}>
                        If you&rsquo;re feeling overwhelmed, support is available.
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
                        Reaching out is a sign of strength. Below are free, confidential resources you can contact anytime.
                    </p>
                </div>
            </div>

            {/* Hotline list */}
            <ul
                role="list"
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", padding: 0, listStyle: "none" }}
                aria-label="Crisis support hotlines"
            >
                {HOTLINES.map((h) => (
                    <li key={h.name} className="hotline-item">
                        <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>
                                {h.country}
                            </span>
                            <span style={{ fontWeight: 500 }}>{h.name}</span>
                        </div>
                        <span className="hotline-number" aria-label={`Contact number: ${h.number}`}>
                            {h.number}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="divider" />

            {/* Professional help nudge */}
            <p style={{ fontSize: "0.9375rem", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
                Speaking with a licensed counsellor or therapist can offer personalised support that
                no app can replace.
            </p>

            {/* Trusted contact – user must initiate */}
            {!showContactForm && !saved && (
                <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => setShowContactForm(true)}
                    aria-expanded={showContactForm}
                >
                    + Add a trusted contact (optional)
                </button>
            )}

            {saved && (
                <p style={{ color: "#0e7490", fontWeight: 500, fontSize: "0.9375rem" }}>
                    ✓ Trusted contact saved locally on your device.
                </p>
            )}

            {showContactForm && (
                <form
                    onSubmit={handleSaveContact}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}
                    aria-label="Add trusted contact form"
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                        This contact is stored only on your device. ReflectAI will never contact them automatically.
                    </p>
                    <div className="form-group">
                        <label className="form-label form-label--required" htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            className="form-input"
                            required
                            placeholder="e.g., Alex"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="contact-phone">Phone (optional)</label>
                        <input
                            id="contact-phone"
                            className="form-input"
                            type="tel"
                            placeholder="+1 555 000 0000"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="contact-email">Email (optional)</label>
                        <input
                            id="contact-email"
                            className="form-input"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" className="btn btn--primary btn--sm">Save contact</button>
                        <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => setShowContactForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
