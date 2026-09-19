export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomPalette {
  primary: string;
  accent: string;
  background: string;
  cardBg: string;
  text: string;
  highlight: string;
}

export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'system';
  paletteType: 'default' | 'custom';
  customPalette: CustomPalette;
  fontFamily: 'sans' | 'serif' | 'mono' | 'handwriting';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
}

export const DEFAULT_PALETTE: CustomPalette = {
  primary: '#7C3AED', // Soft Vibrant Purple
  accent: '#DDD6FE',  // Soft Lavender
  background: '#FAF8F5', // Cream Soft Background
  cardBg: '#FFFFFF', // Pure White Cards
  text: '#1E1B4B', // Deep Slate Purple Text
  highlight: '#F3E8FF', // Soft Pastel Highlight
};

export const DARK_PALETTE: CustomPalette = {
  primary: '#A78BFA',
  accent: '#4C1D95',
  background: '#0F172A',
  cardBg: '#1E293B',
  text: '#F8FAFC',
  highlight: '#334155',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  themeMode: 'light',
  paletteType: 'default',
  customPalette: DEFAULT_PALETTE,
  fontFamily: 'sans',
  fontSize: 'md',
};

export async function getAllEntries(): Promise<DiaryEntry[]> {
  try {
    const res = await fetch('/api/entries', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch entries');
    const entries = await res.json();
    return Array.isArray(entries) ? entries : [];
  } catch (err) {
    console.error('Error fetching all entries from database API:', err);
    return [];
  }
}

export async function getEntryByDate(date: string): Promise<DiaryEntry | null> {
  try {
    const res = await fetch(`/api/entries?date=${encodeURIComponent(date)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const entry = await res.json();
    return entry || null;
  } catch (err) {
    console.error(`Error fetching entry for date ${date}:`, err);
    return null;
  }
}

export async function saveEntry(data: {
  date: string;
  title?: string;
  content: string;
  id?: string;
}): Promise<DiaryEntry> {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to save entry to database');
  }

  const saved = await res.json();
  return saved;
}

export async function deleteEntry(date: string): Promise<void> {
  const res = await fetch(`/api/entries?date=${encodeURIComponent(date)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete entry from database');
  }
}

export async function getDatesWithEntries(): Promise<string[]> {
  const entries = await getAllEntries();
  return entries.map((e) => e.date);
}

export async function exportDiaryData(): Promise<string> {
  const entries = await getAllEntries();
  const prefs = await getPreferences();
  const exportPayload = {
    app: 'Rollercoster',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    entryCount: entries.length,
    entries,
    preferences: prefs,
  };
  return JSON.stringify(exportPayload, null, 2);
}

export async function importDiaryData(jsonData: string): Promise<{ imported: number; updated: number }> {
  const parsed = JSON.parse(jsonData);
  if (!parsed || !Array.isArray(parsed.entries)) {
    throw new Error('Invalid Rollercoster backup file format.');
  }

  let imported = 0;
  let updated = 0;

  for (const entry of parsed.entries) {
    if (!entry.date || typeof entry.content !== 'string') continue;
    const existing = await getEntryByDate(entry.date);
    if (existing) {
      updated++;
    } else {
      imported++;
    }

    await saveEntry({
      date: entry.date,
      title: entry.title || '',
      content: entry.content || '',
      id: entry.id,
    });
  }

  if (parsed.preferences) {
    await savePreferences(parsed.preferences);
  }

  return { imported, updated };
}

export async function getPreferences(): Promise<UserPreferences> {
  try {
    const res = await fetch('/api/preferences', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data) return { ...DEFAULT_PREFERENCES, ...data };
    }
  } catch (err) {
    console.error('Error fetching preferences from API:', err);
  }

  // Fallback to localStorage if API is unreachable
  if (typeof window !== 'undefined') {
    const localStr = localStorage.getItem('rollercoster_prefs');
    if (localStr) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(localStr) };
      } catch (e) {}
    }
  }

  return DEFAULT_PREFERENCES;
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rollercoster_prefs', JSON.stringify(prefs));
  }
  try {
    await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
  } catch (err) {
    console.error('Error saving preferences to database API:', err);
  }
}
