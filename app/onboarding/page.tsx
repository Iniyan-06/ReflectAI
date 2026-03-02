"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBaseline } from "@/lib/storage";

const TOTAL_STEPS = 4;

interface FormData {
    sleepHours: number;
    focusHours: number;
    stressLevel: number;
    goalStatement: string;
    weeklyMoodCheck: boolean;
}

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormData>({
        sleepHours: 7,
        focusHours: 4,
        stressLevel: 3,
        goalStatement: "",
        weeklyMoodCheck: false,
    });

    function updateForm<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleFinish() {
        setSaving(true);
        await saveBaseline(form);
        router.push("/reflect");
    }

    const stepDots = Array.from({ length: TOTAL_STEPS });

    return (
        <div className="main-content" style={{ maxWidth: "560px" }}>
            {/* Header */}
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontWeight: 700, fontSize: "1.625rem", marginBottom: "0.5rem" }}>
                    Set up your baseline
                </h1>
                <p style={{ color: "var(--color-text-muted)" }}>
                    Tell us about your typical week so ReflectAI can notice meaningful changes.
                    This stays entirely on your device.
                </p>
            </div>

            {/* Step dots */}
            <div className="step-indicator" aria-label={`Step ${step} of ${TOTAL_STEPS}`} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
                {stepDots.map((_, i) => (
                    <div
                        key={i}
                        className={`step-dot${i + 1 < step ? " step-dot--done" : i + 1 === step ? " step-dot--active" : ""}`}
                        aria-hidden="true"
                    />
                ))}
                <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    Step {step} of {TOTAL_STEPS}
                </span>
            </div>

            {/* Card */}
            <div className="card card--elevated animate-in delay-100">

                {/* Step 1: Sleep */}
                {step === 1 && (
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                            😴 Sleep patterns
                        </legend>
                        <div className="form-group">
                            <label className="form-label" htmlFor="sleep-hours">
                                On average, how many hours do you sleep per night?
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <input
                                    id="sleep-hours"
                                    type="range"
                                    min={3}
                                    max={12}
                                    step={0.5}
                                    value={form.sleepHours}
                                    className="stress-slider"
                                    style={{ flex: 1 }}
                                    onChange={(e) => updateForm("sleepHours", parseFloat(e.target.value))}
                                    aria-valuetext={`${form.sleepHours} hours`}
                                />
                                <span
                                    style={{
                                        minWidth: "3.5rem",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        fontSize: "1.5rem",
                                        color: "var(--color-primary)",
                                    }}
                                    aria-live="polite"
                                >
                                    {form.sleepHours}h
                                </span>
                            </div>
                            <p className="form-hint">Slide to your typical nightly sleep amount</p>
                        </div>
                    </fieldset>
                )}

                {/* Step 2: Focus */}
                {step === 2 && (
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                            🎯 Focus time
                        </legend>
                        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                            <label className="form-label" htmlFor="focus-hours">
                                How many hours per day do you typically spend in focused work, study, or creative tasks?
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <input
                                    id="focus-hours"
                                    type="range"
                                    min={0.5}
                                    max={12}
                                    step={0.5}
                                    value={form.focusHours}
                                    className="stress-slider"
                                    style={{ flex: 1 }}
                                    onChange={(e) => updateForm("focusHours", parseFloat(e.target.value))}
                                    aria-valuetext={`${form.focusHours} hours`}
                                />
                                <span
                                    style={{
                                        minWidth: "3.5rem",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        fontSize: "1.5rem",
                                        color: "var(--color-primary)",
                                    }}
                                    aria-live="polite"
                                >
                                    {form.focusHours}h
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="stress-baseline">
                                What is your typical stress level on a normal week?
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Low</span>
                                <input
                                    id="stress-baseline"
                                    type="range"
                                    min={1}
                                    max={5}
                                    step={1}
                                    value={form.stressLevel}
                                    className="stress-slider"
                                    style={{ flex: 1 }}
                                    onChange={(e) => updateForm("stressLevel", parseInt(e.target.value))}
                                    aria-valuetext={`${form.stressLevel} out of 5`}
                                />
                                <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>High</span>
                                <span
                                    style={{
                                        minWidth: "2rem",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        fontSize: "1.5rem",
                                        color: "var(--color-primary)",
                                    }}
                                    aria-live="polite"
                                >
                                    {form.stressLevel}
                                </span>
                            </div>
                            <p className="form-hint">1 = very relaxed &nbsp;·&nbsp; 5 = very stressed</p>
                        </div>
                    </fieldset>
                )}

                {/* Step 3: Goal */}
                {step === 3 && (
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                            ✨ Your intention
                        </legend>
                        <div className="form-group">
                            <label className="form-label" htmlFor="goal-statement">
                                What is one thing you&rsquo;d like to be more aware of about yourself?
                            </label>
                            <textarea
                                id="goal-statement"
                                className="form-textarea"
                                placeholder="e.g., I want to notice when I'm sleeping less and feeling more withdrawn..."
                                value={form.goalStatement}
                                onChange={(e) => updateForm("goalStatement", e.target.value)}
                                aria-describedby="goal-hint"
                                maxLength={500}
                            />
                            <p id="goal-hint" className="form-hint">
                                Optional — but useful as a personal anchor. Max 500 characters.
                            </p>
                        </div>
                    </fieldset>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                        <legend style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                            🔔 Preferences
                        </legend>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.875rem",
                                padding: "1.25rem",
                                background: "var(--color-bg)",
                                borderRadius: "var(--radius-md)",
                                border: "1.5px solid var(--color-border)",
                                cursor: "pointer",
                                marginBottom: "1.5rem",
                            }}
                            onClick={() => updateForm("weeklyMoodCheck", !form.weeklyMoodCheck)}
                        >
                            <input
                                id="weekly-mood"
                                type="checkbox"
                                checked={form.weeklyMoodCheck}
                                onChange={(e) => updateForm("weeklyMoodCheck", e.target.checked)}
                                style={{ width: "20px", height: "20px", marginTop: "2px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                            />
                            <label htmlFor="weekly-mood" style={{ cursor: "pointer" }}>
                                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Weekly reflection prompt</strong>
                                <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                                    Show a gentle end-of-week check-in when you open the app on Sundays.
                                </span>
                            </label>
                        </div>

                        {/* Summary */}
                        <div
                            style={{
                                padding: "1.25rem",
                                background: "var(--color-primary-lt)",
                                borderRadius: "var(--radius-md)",
                            }}
                            aria-label="Baseline summary"
                        >
                            <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Your baseline summary</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <li>😴 Sleep: <strong>{form.sleepHours} hours / night</strong></li>
                                <li>🎯 Focus: <strong>{form.focusHours} hours / day</strong></li>
                                <li>📊 Stress: <strong>{form.stressLevel} / 5</strong></li>
                                <li>🔔 Weekly check-ins: <strong>{form.weeklyMoodCheck ? "Yes" : "No"}</strong></li>
                            </ul>
                        </div>
                    </fieldset>
                )}

                {/* Navigation buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "1rem" }}>
                    {step > 1 ? (
                        <button className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < TOTAL_STEPS ? (
                        <button className="btn btn--primary" onClick={() => setStep((s) => s + 1)}>
                            Continue →
                        </button>
                    ) : (
                        <button
                            className="btn btn--primary"
                            onClick={handleFinish}
                            disabled={saving}
                            aria-busy={saving}
                        >
                            {saving ? "Saving…" : "Save & start reflecting →"}
                        </button>
                    )}
                </div>
            </div>

            {/* Privacy note */}
            <p
                style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8125rem", marginTop: "1.25rem" }}
                aria-label="Privacy assurance"
            >
                🔒 Your data never leaves this device. Stored in your browser only.
            </p>
        </div>
    );
}
