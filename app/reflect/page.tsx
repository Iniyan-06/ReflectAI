"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveDailyEntry, getBaseline } from "@/lib/storage";
import { analyseSentiment } from "@/lib/sentiment";

type SocialLevel = "Low" | "Medium" | "High";

export default function ReflectPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        sleepHours: 7,
        focusHours: 4,
        journalText: "",
        stressLevel: 3,
        socialLevel: "Medium" as SocialLevel,
    });

    function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const baseline = await getBaseline();
        if (!baseline) {
            router.push("/onboarding");
            return;
        }

        const { score: sentimentScore } = analyseSentiment(form.journalText);
        const today = new Date().toISOString().split("T")[0];

        await saveDailyEntry({
            date: today,
            sleepHours: form.sleepHours,
            focusHours: form.focusHours,
            journalText: form.journalText,
            stressLevel: form.stressLevel,
            socialLevel: form.socialLevel,
            sentimentScore,
        });

        router.push("/insights");
    }

    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <div className="main-content" style={{ maxWidth: "560px" }}>
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", marginBottom: "0.25rem" }}>{today}</p>
                <h1 style={{ fontWeight: 700, fontSize: "1.625rem", marginBottom: "0.5rem" }}>
                    Daily reflection
                </h1>
                <p style={{ color: "var(--color-text-muted)" }}>
                    Take 2 minutes to check in with yourself. All answers are private to you.
                </p>
            </div>

            <form onSubmit={handleSubmit} aria-label="Daily reflection form" noValidate>

                {/* Sleep */}
                <div className="card animate-in delay-100" style={{ marginBottom: "1.25rem" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="sleep-today">
                            😴 How many hours did you sleep last night?
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <input
                                id="sleep-today"
                                type="range"
                                min={2}
                                max={14}
                                step={0.5}
                                value={form.sleepHours}
                                className="stress-slider"
                                style={{ flex: 1 }}
                                onChange={(e) => updateField("sleepHours", parseFloat(e.target.value))}
                                aria-valuetext={`${form.sleepHours} hours`}
                            />
                            <span
                                style={{ minWidth: "3rem", fontWeight: 700, fontSize: "1.375rem", color: "var(--color-primary)", textAlign: "center" }}
                                aria-live="polite"
                            >
                                {form.sleepHours}h
                            </span>
                        </div>
                    </div>
                </div>

                {/* Focus */}
                <div className="card animate-in delay-100" style={{ marginBottom: "1.25rem" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="focus-today">
                            🎯 How many hours of focused work or study did you do today?
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <input
                                id="focus-today"
                                type="range"
                                min={0}
                                max={14}
                                step={0.5}
                                value={form.focusHours}
                                className="stress-slider"
                                style={{ flex: 1 }}
                                onChange={(e) => updateField("focusHours", parseFloat(e.target.value))}
                                aria-valuetext={`${form.focusHours} hours`}
                            />
                            <span
                                style={{ minWidth: "3rem", fontWeight: 700, fontSize: "1.375rem", color: "var(--color-primary)", textAlign: "center" }}
                                aria-live="polite"
                            >
                                {form.focusHours}h
                            </span>
                        </div>
                    </div>
                </div>

                {/* Journal */}
                <div className="card animate-in delay-200" style={{ marginBottom: "1.25rem" }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="journal-text">
                            📝 How are you feeling today? (optional journal)
                        </label>
                        <textarea
                            id="journal-text"
                            className="form-textarea"
                            placeholder="Write freely — what's on your mind? What went well? What felt heavy? There's no right answer..."
                            value={form.journalText}
                            onChange={(e) => updateField("journalText", e.target.value)}
                            aria-describedby="journal-hint"
                            maxLength={2000}
                        />
                        <p id="journal-hint" className="form-hint">
                            Your words are analysed locally in your browser. They are never sent anywhere.
                        </p>
                    </div>
                </div>

                {/* Stress */}
                <div className="card animate-in delay-200" style={{ marginBottom: "1.25rem" }}>
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend className="form-label" style={{ marginBottom: "1rem" }}>
                            📊 Stress level today
                        </legend>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>1 – Low</span>
                            <input
                                type="range"
                                min={1}
                                max={5}
                                step={1}
                                value={form.stressLevel}
                                className="stress-slider"
                                style={{ flex: 1 }}
                                onChange={(e) => updateField("stressLevel", parseInt(e.target.value))}
                                aria-label={`Stress level: ${form.stressLevel} out of 5`}
                                aria-valuetext={`${form.stressLevel} out of 5`}
                            />
                            <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>5 – High</span>
                            <span
                                style={{ minWidth: "2rem", fontWeight: 700, fontSize: "1.375rem", color: "var(--color-primary)", textAlign: "center" }}
                                aria-live="polite"
                            >
                                {form.stressLevel}
                            </span>
                        </div>
                    </fieldset>
                </div>

                {/* Social */}
                <div className="card animate-in delay-300" style={{ marginBottom: "2rem" }}>
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend className="form-label" style={{ marginBottom: "1rem" }}>
                            🤝 Social interaction today
                        </legend>
                        <div
                            role="group"
                            aria-label="Social interaction level"
                            style={{ display: "flex", gap: "0.75rem" }}
                        >
                            {(["Low", "Medium", "High"] as SocialLevel[]).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    role="radio"
                                    aria-checked={form.socialLevel === level}
                                    onClick={() => updateField("socialLevel", level)}
                                    style={{
                                        flex: 1,
                                        padding: "0.875rem",
                                        borderRadius: "var(--radius-md)",
                                        border: `2px solid ${form.socialLevel === level ? "var(--color-primary)" : "var(--color-border)"}`,
                                        background: form.socialLevel === level ? "var(--color-primary-lt)" : "var(--color-surface)",
                                        color: form.socialLevel === level ? "var(--color-primary)" : "var(--color-text-muted)",
                                        fontWeight: form.socialLevel === level ? 600 : 400,
                                        fontSize: "0.9375rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    {level === "Low" ? "😶 Low" : level === "Medium" ? "🙂 Medium" : "😊 High"}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn--primary btn--full btn--lg"
                    disabled={saving}
                    aria-busy={saving}
                >
                    {saving ? "Saving reflection…" : "Save & see insights →"}
                </button>

                <p
                    style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8125rem", marginTop: "1rem" }}
                    aria-label="Privacy reminder"
                >
                    🔒 Stored locally on your device only
                </p>
            </form>
        </div>
    );
}
