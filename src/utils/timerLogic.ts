export function calculateRemainingSeconds(
  startTimestamp: number,
  pausedRemainingSeconds: number,
  nowTimestamp: number = Date.now()
): number {
  if (!startTimestamp || pausedRemainingSeconds <= 0) return 0;
  const elapsed = Math.floor((nowTimestamp - startTimestamp) / 1000);
  return Math.max(0, pausedRemainingSeconds - elapsed);
}

export function formatTimeDisplay(totalSeconds: number): { minutes: string; seconds: string } {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60);
  const secs = Math.max(0, totalSeconds) % 60;
  return {
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
}

export function calculateXpGained(durationMinutes: number, completionBonus = 20): number {
  return Math.max(0, durationMinutes * 4 + completionBonus);
}

export function calculateLevelFromXp(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / 500) + 1;
}

export function calculateProjectProgress(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.min(100, Math.round((completedCount / totalCount) * 100));
}
