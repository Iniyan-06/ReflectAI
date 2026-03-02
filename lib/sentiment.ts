/**
 * ReflectAI – Sentiment Analysis
 *
 * Uses the `sentiment` npm package (AFINN lexicon, ~8 KB).
 * All analysis runs entirely in the browser – no text is ever transmitted.
 *
 * Output: normalised score in roughly [-5, +5]
 *   > +1  = noticeably positive
 *   0     = neutral
 *   < -1  = noticeably negative
 */

import Sentiment from "sentiment";

const analyser = new Sentiment();

export interface SentimentResult {
    /** Normalised score: raw AFINN score divided by max(token count, 1). */
    score: number;
    /** Friendly label. */
    label: "Positive" | "Neutral" | "Negative";
    /** Positive tokens identified (e.g. "happy", "great"). Capped at 5. */
    positiveWords: string[];
    /** Negative tokens identified. Capped at 5. */
    negativeWords: string[];
}

export function analyseSentiment(text: string): SentimentResult {
    if (!text || text.trim().length === 0) {
        return { score: 0, label: "Neutral", positiveWords: [], negativeWords: [] };
    }

    const result = analyser.analyze(text);
    const tokenCount = Math.max(result.tokens.length, 1);
    // Normalise: AFINN words score from -5 to +5 each; divide by tokens for density
    const score = parseFloat((result.score / tokenCount).toFixed(2));

    const label: SentimentResult["label"] =
        score > 0.4 ? "Positive" : score < -0.4 ? "Negative" : "Neutral";

    const positiveWords = (result.positive as string[]).slice(0, 5);
    const negativeWords = (result.negative as string[]).slice(0, 5);

    return { score, label, positiveWords, negativeWords };
}
