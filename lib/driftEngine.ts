/**
 * ReflectAI – Behavioral Drift Engine
 *
 * IMPORTANT: This module intentionally avoids all clinical terminology.
 * It detects statistical deviation from a personal baseline only.
 * It does not diagnose, predict, or classify mental health conditions.
 *
 * Algorithm overview:
 *   1. Compute z-scores for each metric relative to user baseline.
 *   2. Average absolute z-scores over the last 7 days.
 *   3. Map average z to a DriftLevel.
 *   4. Calculate StabilityScore (0–100, higher = more stable).
 *   5. Generate plain-language insight strings (no clinical labels).
 */

import { BaselineProfile, DailyEntry } from "./storage";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DriftLevel = "Stable" | "Mild Shift" | "Moderate Shift" | "Significant Shift";
export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface DriftResult {
    stabilityScore: number;        // 0–100
    driftLevel: DriftLevel;
    confidence: ConfidenceLevel;
    insights: string[];            // Gentle, plain-language observations
    showCrisisSafeguard: boolean;  // Show support resources?
    metrics: {
        sleepDeviation: number;      // z-score
        focusDeviation: number;
        stressDeviation: number;
        sentimentDeviation: number;
        avgAbsZ: number;
    };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Standard deviation of an array. Falls back to 1 to avoid division by zero. */
function stdDev(values: number[]): number {
    if (values.length < 2) return 1;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.max(Math.sqrt(variance), 0.01);
}

function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

// ─── Main Engine ─────────────────────────────────────────────────────────────

export function computeDrift(
    baseline: BaselineProfile,
    recentEntries: DailyEntry[] // sorted oldest → newest, last ≤ 7 days
): DriftResult {
    // ── Confidence based on sample size ────────────────────────────────────────
    const n = recentEntries.length;
    const confidence: ConfidenceLevel =
        n >= 7 ? "High" : n >= 3 ? "Medium" : "Low";

    if (n === 0) {
        return {
            stabilityScore: 100,
            driftLevel: "Stable",
            confidence: "Low",
            insights: ["Start logging daily reflections to see your personal insights here."],
            showCrisisSafeguard: false,
            metrics: {
                sleepDeviation: 0,
                focusDeviation: 0,
                stressDeviation: 0,
                sentimentDeviation: 0,
                avgAbsZ: 0,
            },
        };
    }

    // ── Extract metric arrays ──────────────────────────────────────────────────
    const sleepValues = recentEntries.map((e) => e.sleepHours);
    const focusValues = recentEntries.map((e) => e.focusHours);
    const stressValues = recentEntries.map((e) => e.stressLevel);
    const sentValues = recentEntries.map((e) => e.sentimentScore);

    // ── Compute z-scores relative to personal baseline ────────────────────────
    // For std-dev we use the recent-window spread (gives a sense of within-week variability)
    // but the mean anchor is always the user's declared baseline.

    const sleepSD = stdDev(sleepValues);
    const focusSD = stdDev(focusValues);
    const stressSD = stdDev(stressValues);
    const sentSD = Math.max(stdDev(sentValues), 0.5);

    const sleepZ = (mean(sleepValues) - baseline.sleepHours) / sleepSD;
    const focusZ = (mean(focusValues) - baseline.focusHours) / focusSD;
    const stressZ = (mean(stressValues) - baseline.stressLevel) / stressSD;
    const sentZ = mean(sentValues) / sentSD; // neutral anchor is 0

    // Weighted average (stress & sentiment count a bit more for wellbeing signal)
    const weights = [1, 1, 1.2, 1.2];
    const absZs = [Math.abs(sleepZ), Math.abs(focusZ), Math.abs(stressZ), Math.abs(sentZ)];
    const totalW = weights.reduce((a, b) => a + b, 0);
    const avgAbsZ = absZs.reduce((sum, z, i) => sum + z * weights[i], 0) / totalW;

    // ── Stability score ────────────────────────────────────────────────────────
    // avgAbsZ of 0 → 100, avgAbsZ of 2 → 0
    const stabilityScore = clamp(Math.round(100 - avgAbsZ * 50), 0, 100);

    // ── Drift level ───────────────────────────────────────────────────────────
    let driftLevel: DriftLevel;
    if (avgAbsZ < 0.5) driftLevel = "Stable";
    else if (avgAbsZ < 1.0) driftLevel = "Mild Shift";
    else if (avgAbsZ < 1.5) driftLevel = "Moderate Shift";
    else driftLevel = "Significant Shift";

    // ── Insight strings (NO clinical language) ────────────────────────────────
    const insights: string[] = [];

    // Sleep insights
    const avgSleep = mean(sleepValues);
    const sleepDiff = parseFloat((avgSleep - baseline.sleepHours).toFixed(1));
    if (Math.abs(sleepZ) >= 0.5) {
        if (sleepDiff < 0) {
            insights.push(
                `Your average sleep this week (${avgSleep.toFixed(1)} hrs) is about ${Math.abs(sleepDiff)} hrs below your usual amount.`
            );
        } else {
            insights.push(
                `Your sleep has been a bit longer than usual this week (${avgSleep.toFixed(1)} hrs vs your baseline of ${baseline.sleepHours} hrs).`
            );
        }
    }
    // Focus insights
    const avgFocus = mean(focusValues);
    const focusDiff = parseFloat((avgFocus - baseline.focusHours).toFixed(1));
    if (Math.abs(focusZ) >= 0.5) {
        if (focusDiff < 0) {
            insights.push(
                `Your focused time appears lower this week (${avgFocus.toFixed(1)} hrs/day vs your typical ${baseline.focusHours} hrs).`
            );
        } else {
            insights.push(
                `You've been putting in more focused time than usual this week — ${avgFocus.toFixed(1)} hrs/day.`
            );
        }
    }

    // Stress insights
    const avgStress = mean(stressValues);
    if (Math.abs(stressZ) >= 0.5) {
        if (avgStress > baseline.stressLevel) {
            insights.push(
                `Your stress ratings have been higher than your baseline recently. Would you like to reflect on what may be contributing?`
            );
        } else {
            insights.push(
                `Your stress ratings appear lower than usual this week — that's worth noticing.`
            );
        }
    }

    // Sentiment insights
    const avgSent = mean(sentValues);
    if (Math.abs(sentZ) >= 0.5) {
        if (avgSent < -0.3) {
            insights.push(
                `Your journal tone has been leaning slightly more negative this week. Sometimes writing about what's on your mind can help.`
            );
        } else if (avgSent > 0.3) {
            insights.push(
                `Your journal entries have had a noticeably positive tone this week.`
            );
        }
    }

    // Variability insight (high sleep variability)
    if (stdDev(sleepValues) > 1.5) {
        insights.push(
            `Your sleep variability has been elevated this week — your hours have been quite inconsistent day to day.`
        );
    }

    // If nothing notable found
    if (insights.length === 0) {
        insights.push("Your patterns look fairly consistent with your baseline this week.");
    }

    // ── Crisis safeguard ──────────────────────────────────────────────────────
    // Only show if SUSTAINED significant drift with at least medium confidence
    const showCrisisSafeguard =
        driftLevel === "Significant Shift" && confidence !== "Low";

    return {
        stabilityScore,
        driftLevel,
        confidence,
        insights,
        showCrisisSafeguard,
        metrics: {
            sleepDeviation: parseFloat(sleepZ.toFixed(2)),
            focusDeviation: parseFloat(focusZ.toFixed(2)),
            stressDeviation: parseFloat(stressZ.toFixed(2)),
            sentimentDeviation: parseFloat(sentZ.toFixed(2)),
            avgAbsZ: parseFloat(avgAbsZ.toFixed(2)),
        },
    };
}
