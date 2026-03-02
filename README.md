# **ReflectAI — Ethical Mental Health Reflection Engine**

**Privacy-First • Behavioral Drift Detection • Non-Diagnostic Self-Reflection**
**Next.js • TailwindCSS • Client-Side AI • Zero Data Transmission**

<div align="center">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Sentiment%20Analysis-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Design-Accessible%20%26%20Clean-success?style=for-the-badge" />
  <a href="https://reflect-ai-xi.vercel.app/">
    <img src="https://img.shields.io/badge/Demo-Live%20on%20Vercel-orange?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Status-Operational-green?style=for-the-badge" />
</div>

<p align="center">
  <a href="https://reflect-ai-xi.vercel.app/"><strong>🚀 Explore the Live Demo</strong></a>
</p>

---

## 📚 Table of Contents

* [Overview](#-overview)
* [What Makes It Different](#-what-makes-it-different)
* [Core Experience](#-core-experience)
* [The Drift Engine](#-the-drift-engine)
* [Folder Structure](#-folder-structure)
* [Tech Stack](#-tech-stack)
* [Privacy Architecture](#-privacy-architecture)
* [Running Locally](#-running-locally)
* [Deployment](#-deployment)
* [Why ReflectAI?](#-why-reflectai)

---

## 🌀 Overview

**ReflectAI** is a gentle, privacy-preserving mirror for your daily patterns.

Most health apps want to categorize you. They diagnose you, label you, and sync your most intimate thoughts to a cloud you don't control.

**ReflectAI does none of that.**

It helps you notice the subtle shifts in your sleep, focus, and mood before they become overwhelming. It provides gentle, plain-language observations based on a personal baseline that *you* define.

No medical claims. 
No clinical labels. 
No surveillance.

---

## ✨ What Makes It Different

| Feature | Traditional Wellness Apps | ReflectAI |
| :--- | :--- | :--- |
| **Data Storage** | Cloud-based / Third-party | 100% Local (IndexedDB) |
| **Analysis** | Server-side / Black box | Client-side / Transparent |
| **Terminology** | Clinical labels (Anxiety/Depression) | Pattern-based (Drift/Stability) |
| **Goal** | Diagnosis & Treatment | Self-reflection & Awareness |
| **Privacy** | Terms of Service "Sharing" | Zero Data Transmission |

---

## 🎨 Core Experience

1. **Baseline Setup**: You voluntarily define your typical sleep, focus hours, and stress levels.
2. **Daily Reflection**: A low-friction input for sleep, focus, stress, and a private journal.
3. **Sentiment Analysis**: A lightweight on-device engine analyzes the tone of your journal entries.
4. **Behavioral Drift**: The engine compares current data to your baseline using statistical z-scores.
5. **Gentle Output**: Results are presented as "Stability Scores" and supportive observations.
6. **Crisis Safeguard**: If significant drift is sustained, the system provides non-alarming support resources.

---

## 🧬 The Drift Engine

### What is *Drift*?

`Drift` refers to the statistical deviation of your current metrics from your personal baseline.

*   **Metric Weights**: Stress and Sentiment are weighted slightly higher for wellness signals.
*   **Confidence**: Accuracy increases as you log more days (Low < 3 days → High 7+ days).
*   **Plain Language**: Instead of alerts, you get reflections: *"Your sleep variability increased this week."*

### Phase-Based Breakdown

| Drift Level | Interpretation |
| :--- | :--- |
| **Stable** | Patterns are consistent with your personal baseline. |
| **Mild Shift** | Normal day-to-day fluctuations. |
| **Moderate Shift** | Noticeable change across multiple metrics or days. |
| **Significant Shift** | Multiple patterns have shifted meaningfully. Consider a self-check-in. |

---

## 📁 Folder Structure

```text
reflectai/
├─ app/
│  ├─ layout.tsx       # Root layout with Inter font & Nav
│  ├─ page.tsx         # Home / Landing page
│  ├─ onboarding/      # 4-step baseline setup
│  ├─ reflect/         # Daily input & journal
│  ├─ insights/        # Stability ring & drift analysis
│  ├─ dashboard/       # Recharts trend visualization
│  ├─ transparency/    # "How It Works" & limitations
│  └─ privacy/         # Data management (Export/Delete)
│
├─ components/
│  ├─ Navigation.tsx   # Accessible sticky nav
│  └─ CrisisSafeguard.tsx # International hotline list
│
├─ lib/
│  ├─ storage.ts       # Typed IndexedDB wrapper (idb)
│  ├─ sentiment.ts     # Client-side AFINN analyzer
│  └─ driftEngine.ts   # Z-score deviation logic
│
└─ public/             # Static assets
```

---

## 🧪 Tech Stack

*   **Core**: Next.js 15 (App Router)
*   **Styling**: TailwindCSS (Colorblind-safe palette)
*   **Storage**: IndexedDB (via `idb` library)
*   **AI**: `sentiment` (AFINN-based client-side lexicon)
*   **Charts**: Recharts (Responsive trend lines)
*   **Fonts**: Inter via `next/font`

---

## 🔒 Privacy Architecture

*   **Zero-Cloud**: There is no "Sign Up". Your identity is not required.
*   **On-Device AI**: Sentiment analysis happens in your browser's memory. Your text never crosses the wire.
*   **Data Ownership**: An "Export JSON" button in the Privacy tab lets you take your data with you.
*   **Kill Switch**: A permanent "Delete All Data" option clears the local IndexedDB instantly.

---

## ▶ Running Locally

```bash
# Clone the repository
git clone https://github.com/your-repo/reflectai.git

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your reflection journey.

---

## 🌐 Deployment

ReflectAI is designed for static or serverless deployment.

*   **Vercel**: Deploy with zero configuration.
*   **Static Export**: Run `npm run build` and host on GitHub Pages or Netlify.

---

## 🎯 Use Cases

*   **Personal Wellness**: Tracking how life events impact your baseline.
*   **Digital Detox**: Monitoring focus levels during reduced screen time.
*   **Private Journaling**: Writing with the benefit of objective sentiment tracking.
*   **Ethical AI Demo**: A template for apps that prioritize user agency over data collection.

---

## 💭 Why ReflectAI?

> “The system doesn't need to know who you are to help you see where you're going.”

ReflectAI explores what happens when tech stops being a surveillance tool and starts being a supportive mirror. It is not about "fixing" you; it is about helping you notice yourself.

---

<p align="center" style="font-size:18px; color:#2563eb;">
  <i><b>“Notice the small shifts. Before they become big ones.”</b></i>
</p>
