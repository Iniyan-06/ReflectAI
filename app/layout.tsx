import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReflectAI – Ethical Mental Health Reflection Engine",
  description:
    "A privacy-first self-reflection tool that helps you notice subtle changes in your daily patterns. Not a medical tool. All data stays on your device.",
  keywords: ["mental wellness", "self-reflection", "journaling", "behavioral patterns", "privacy-first"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        {/* Skip navigation for screen readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <div className="page-wrapper">
          <Navigation />
          <main id="main-content" role="main">
            {children}
          </main>

          {/* Footer */}
          <footer
            role="contentinfo"
            style={{
              borderTop: "1px solid var(--color-border)",
              padding: "1.5rem 1.25rem",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              background: "var(--color-surface)",
            }}
          >
            <p>
              ReflectAI is <strong>not a medical tool</strong> and cannot diagnose or treat any condition.
              {" "}
              <a href="/transparency" style={{ color: "var(--color-primary)" }}>Learn more</a>
              {" · "}
              <a href="/privacy" style={{ color: "var(--color-primary)" }}>Privacy</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
