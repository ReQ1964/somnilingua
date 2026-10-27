import { useEffect, useState, useCallback } from "react";

export type ActivityType = "watching" | "listening" | "reading" | "speaking" | "writing" | "studying" | "other";

export interface Activity {
  id: string;
  languageId: string;
  type: ActivityType;
  minutes: number;
  date: string; // ISO yyyy-mm-dd
  notes?: string;
  createdAt: number;
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  startingHours: number; // hours user already had when adding
  dailyGoalMin: number;
  createdAt: number;
}

const LANG_KEY = "lt.languages";
const ACT_KEY = "lt.activities";

function read<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

export function useLanguages() {
  const [langs, setLangs] = useState<Language[]>(() => read<Language[]>(LANG_KEY, []));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    const onChange = () => setLangs(read<Language[]>(LANG_KEY, []));
    listeners.add(onChange);
    return () => {
      clearTimeout(t);
      listeners.delete(onChange);
    };
  }, []);

  const add = useCallback((l: Omit<Language, "id" | "createdAt">) => {
    const next: Language = { ...l, id: crypto.randomUUID(), createdAt: Date.now() };
    const all = [...read<Language[]>(LANG_KEY, []), next];
    localStorage.setItem(LANG_KEY, JSON.stringify(all));
    notify();
    return next;
  }, []);

  const update = useCallback((id: string, patch: Partial<Language>) => {
    const all = read<Language[]>(LANG_KEY, []).map((x) => (x.id === id ? { ...x, ...patch } : x));
    localStorage.setItem(LANG_KEY, JSON.stringify(all));
    notify();
  }, []);

  const remove = useCallback((id: string) => {
    const all = read<Language[]>(LANG_KEY, []).filter((x) => x.id !== id);
    localStorage.setItem(LANG_KEY, JSON.stringify(all));
    const acts = read<Activity[]>(ACT_KEY, []).filter((a) => a.languageId !== id);
    localStorage.setItem(ACT_KEY, JSON.stringify(acts));
    notify();
  }, []);

  return { languages: langs, loading, add, update, remove };
}

export function useActivities(languageId?: string) {
  const [acts, setActs] = useState<Activity[]>(() => read<Activity[]>(ACT_KEY, []));
  useEffect(() => {
    const onChange = () => setActs(read<Activity[]>(ACT_KEY, []));
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const filtered = languageId ? acts.filter((a) => a.languageId === languageId) : acts;

  const add = useCallback((a: Omit<Activity, "id" | "createdAt">) => {
    const next: Activity = { ...a, id: crypto.randomUUID(), createdAt: Date.now() };
    const all = [...read<Activity[]>(ACT_KEY, []), next];
    localStorage.setItem(ACT_KEY, JSON.stringify(all));
    notify();
    return next;
  }, []);

  const update = useCallback((id: string, patch: Partial<Activity>) => {
    const all = read<Activity[]>(ACT_KEY, []).map((x) => (x.id === id ? { ...x, ...patch } : x));
    localStorage.setItem(ACT_KEY, JSON.stringify(all));
    notify();
  }, []);

  const remove = useCallback((id: string) => {
    const all = read<Activity[]>(ACT_KEY, []).filter((x) => x.id !== id);
    localStorage.setItem(ACT_KEY, JSON.stringify(all));
    notify();
  }, []);

  return { activities: filtered, allActivities: acts, add, update, remove };
}

// helpers
export function totalHours(language: Language, activities: Activity[]): number {
  const min = activities.filter((a) => a.languageId === language.id).reduce((s, a) => s + a.minutes, 0);
  return language.startingHours + min / 60;
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function minutesOnDate(activities: Activity[], date: string, languageId?: string): number {
  return activities
    .filter((a) => a.date === date && (!languageId || a.languageId === languageId))
    .reduce((s, a) => s + a.minutes, 0);
}

export function calcStreak(activities: Activity[], dailyGoal: number, languageId?: string): number {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const k = todayKey(d);
    const m = minutesOnDate(activities, k, languageId);
    if (m >= dailyGoal && dailyGoal > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (streak === 0 && k === todayKey()) {
      // today not done yet - check yesterday
      d.setDate(d.getDate() - 1);
      const k2 = todayKey(d);
      const m2 = minutesOnDate(activities, k2, languageId);
      if (m2 >= dailyGoal && dailyGoal > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    } else break;
  }
  return streak;
}