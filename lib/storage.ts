/**
 * ReflectAI – Storage Layer
 * All data stays on-device (IndexedDB). Nothing is transmitted externally.
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";

// ─── Data Models ────────────────────────────────────────────────────────────

export interface BaselineProfile {
  id: "baseline"; // singleton
  sleepHours: number; // average hours of sleep
  focusHours: number; // average hours of focused work / study
  stressLevel: number; // 1–5
  goalStatement: string; // free text, personal goal
  weeklyMoodCheck: boolean; // whether they want weekly prompts
  createdAt: string; // ISO timestamp
}

export interface DailyEntry {
  id: string; // ISO date string "YYYY-MM-DD"
  date: string;
  sleepHours: number;
  focusHours: number;
  journalText: string;
  stressLevel: number; // 1–5
  socialLevel: "Low" | "Medium" | "High";
  sentimentScore: number; // AFINN-based, normalised to roughly [-5, +5]
  createdAt: string;
}

export interface TrustedContact {
  id: "contact"; // singleton
  name: string;
  phone: string;
  email: string;
  addedAt: string;
}

// ─── DB Schema ───────────────────────────────────────────────────────────────

interface ReflectDB extends DBSchema {
  baseline: {
    key: string;
    value: BaselineProfile;
  };
  entries: {
    key: string;
    value: DailyEntry;
  };
  contact: {
    key: string;
    value: TrustedContact;
  };
}

// ─── DB Instance ─────────────────────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase<ReflectDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ReflectDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ReflectDB>("reflectai-db", 1, {
      upgrade(db) {
        db.createObjectStore("baseline", { keyPath: "id" });
        db.createObjectStore("entries", { keyPath: "id" });
        db.createObjectStore("contact", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

// ─── Baseline ────────────────────────────────────────────────────────────────

export async function saveBaseline(profile: Omit<BaselineProfile, "id" | "createdAt">): Promise<void> {
  const db = await getDB();
  await db.put("baseline", {
    ...profile,
    id: "baseline",
    createdAt: new Date().toISOString(),
  });
}

export async function getBaseline(): Promise<BaselineProfile | undefined> {
  const db = await getDB();
  return db.get("baseline", "baseline");
}

// ─── Daily Entries ───────────────────────────────────────────────────────────

export async function saveDailyEntry(entry: Omit<DailyEntry, "id" | "createdAt">): Promise<void> {
  const db = await getDB();
  const id = entry.date; // one entry per calendar day
  await db.put("entries", { ...entry, id, createdAt: new Date().toISOString() });
}

export async function getAllEntries(): Promise<DailyEntry[]> {
  const db = await getDB();
  const all = await db.getAll("entries");
  return all.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getRecentEntries(days = 7): Promise<DailyEntry[]> {
  const all = await getAllEntries();
  return all.slice(-days);
}

export async function getEntryByDate(date: string): Promise<DailyEntry | undefined> {
  const db = await getDB();
  return db.get("entries", date);
}

// ─── Trusted Contact ─────────────────────────────────────────────────────────

export async function saveTrustedContact(contact: Omit<TrustedContact, "id" | "addedAt">): Promise<void> {
  const db = await getDB();
  await db.put("contact", { ...contact, id: "contact", addedAt: new Date().toISOString() });
}

export async function getTrustedContact(): Promise<TrustedContact | undefined> {
  const db = await getDB();
  return db.get("contact", "contact");
}

// ─── Data Management ─────────────────────────────────────────────────────────

/** Export all data as a JSON string (for user download). */
export async function exportAllData(): Promise<string> {
  const [baseline, entries, contact] = await Promise.all([
    getBaseline(),
    getAllEntries(),
    getTrustedContact(),
  ]);
  return JSON.stringify({ baseline, entries, contact }, null, 2);
}

/** Delete all stored data – irreversible. */
export async function deleteAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear("baseline"),
    db.clear("entries"),
    db.clear("contact"),
  ]);
}
