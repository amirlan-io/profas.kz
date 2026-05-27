const STORAGE_KEY = 'profas.learningStreak';

export type StreakData = {
  dates: string[];
  lastVisit: string;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dates: [], lastVisit: '' };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { dates: [], lastVisit: '' };
  }
}

function save(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordLearningActivity(): StreakData {
  const today = todayKey();
  const data = load();
  if (!data.dates.includes(today)) {
    data.dates = [...data.dates, today].sort();
  }
  data.lastVisit = today;
  save(data);
  return data;
}

export function getStreakData(): StreakData {
  return load();
}

export function getStreakCount(): number {
  const dates = new Set(load().dates);
  if (dates.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const today = cursor.toISOString().slice(0, 10);
  const yesterday = new Date(cursor);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (!dates.has(today) && !dates.has(yesterdayKey)) return 0;
  if (!dates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getLast7Days(): { date: string; active: boolean; label: string }[] {
  const activeSet = new Set(load().dates);
  const days: { date: string; active: boolean; label: string }[] = [];
  const labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      active: activeSet.has(key),
      label: labels[d.getDay()],
    });
  }
  return days;
}
