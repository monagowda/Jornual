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

const DB_NAME = 'RollercosterDB';
const DB_VERSION = 1;
const STORE_ENTRIES = 'entries';
const STORE_PREFS = 'preferences';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is only available in browser environments.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ENTRIES)) {
        const entryStore = db.createObjectStore(STORE_ENTRIES, { keyPath: 'date' });
        entryStore.createIndex('id', 'id', { unique: true });
        entryStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_PREFS)) {
        db.createObjectStore(STORE_PREFS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllEntries(): Promise<DiaryEntry[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ENTRIES, 'readonly');
      const store = tx.objectStore(STORE_ENTRIES);
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = (request.result as DiaryEntry[]) || [];
        // Sort by date descending
        entries.sort((a, b) => b.date.localeCompare(a.date));
        resolve(entries);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error fetching all entries:', err);
    return [];
  }
}

export async function getEntryByDate(date: string): Promise<DiaryEntry | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ENTRIES, 'readonly');
      const store = tx.objectStore(STORE_ENTRIES);
      const request = store.get(date);

      request.onsuccess = () => {
        resolve((request.result as DiaryEntry) || null);
      };
      request.onerror = () => reject(request.error);
    });
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
  const db = await openDB();
  const existing = await getEntryByDate(data.date);
  const now = new Date().toISOString();

  const entryToSave: DiaryEntry = {
    id: existing?.id || data.id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: data.date,
    title: data.title !== undefined ? data.title.trim() : existing?.title || '',
    content: data.content,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ENTRIES, 'readwrite');
    const store = tx.objectStore(STORE_ENTRIES);
    const request = store.put(entryToSave);

    request.onsuccess = () => resolve(entryToSave);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteEntry(date: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ENTRIES, 'readwrite');
    const store = tx.objectStore(STORE_ENTRIES);
    const request = store.delete(date);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
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

  const db = await openDB();
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

    const cleanEntry: DiaryEntry = {
      id: entry.id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: entry.date,
      title: entry.title || '',
      content: entry.content || '',
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || new Date().toISOString(),
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ENTRIES, 'readwrite');
      const store = tx.objectStore(STORE_ENTRIES);
      const request = store.put(cleanEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  if (parsed.preferences) {
    await savePreferences(parsed.preferences);
  }

  return { imported, updated };
}

export async function getPreferences(): Promise<UserPreferences> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PREFS, 'readonly');
      const store = tx.objectStore(STORE_PREFS);
      const request = store.get('user_prefs');

      request.onsuccess = () => {
        if (request.result && request.result.value) {
          resolve({ ...DEFAULT_PREFERENCES, ...request.result.value });
        } else {
          // Check localStorage as fallback
          const localStr = typeof window !== 'undefined' ? localStorage.getItem('rollercoster_prefs') : null;
          if (localStr) {
            try {
              resolve({ ...DEFAULT_PREFERENCES, ...JSON.parse(localStr) });
              return;
            } catch (e) {
              // ignore JSON parse error
            }
          }
          resolve(DEFAULT_PREFERENCES);
        }
      };
      request.onerror = () => resolve(DEFAULT_PREFERENCES);
    });
  } catch (err) {
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rollercoster_prefs', JSON.stringify(prefs));
  }
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PREFS, 'readwrite');
      const store = tx.objectStore(STORE_PREFS);
      const request = store.put({ key: 'user_prefs', value: prefs });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error saving preferences to IndexedDB:', err);
  }
}
