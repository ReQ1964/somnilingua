export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LevelInfo {
  level: CEFRLevel;
  hours: number;
  words: number;
  descKey: string;
}

// Refold-style hour estimates for immersion learners
export const LEVELS: LevelInfo[] = [
  { level: "A1", hours: 50, words: 500, descKey: "level.a1" },
  { level: "A2", hours: 150, words: 1200, descKey: "level.a2" },
  { level: "B1", hours: 400, words: 2500, descKey: "level.b1" },
  { level: "B2", hours: 900, words: 5000, descKey: "level.b2" },
  { level: "C1", hours: 1800, words: 10000, descKey: "level.c1" },
  { level: "C2", hours: 3000, words: 16000, descKey: "level.c2" },
];

export function levelFromHours(hours: number): CEFRLevel {
  let current: CEFRLevel = "A1";
  for (const l of LEVELS) {
    if (hours >= l.hours) current = l.level;
  }
  // If less than A1 hours, still show A1 as in-progress
  if (hours < LEVELS[0].hours) return "A1";
  return current;
}

export function nextLevel(level: CEFRLevel): LevelInfo | null {
  const idx = LEVELS.findIndex((l) => l.level === level);
  if (idx === -1 || idx === LEVELS.length - 1) return null;
  return LEVELS[idx + 1];
}

export function progressToNext(hours: number): { current: LevelInfo; next: LevelInfo | null; pct: number } {
  const lvl = levelFromHours(hours);
  const current = LEVELS.find((l) => l.level === lvl)!;
  const next = nextLevel(lvl);
  if (!next) return { current, next: null, pct: 100 };
  const span = next.hours - current.hours;
  const done = Math.max(0, hours - current.hours);
  return { current, next, pct: Math.min(100, (done / span) * 100) };
}