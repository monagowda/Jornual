'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAllEntries, deleteEntry, DiaryEntry } from '@/lib/diaryStorage';
import { EntryGrid } from '@/components/journal/EntryGrid';
import { Edit3, Sun, Moon, Sunrise, Sunset, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEntries = useCallback(async () => {
    const list = await getAllEntries();
    setEntries(list);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDeleteEntry = async (date: string) => {
    await deleteEntry(date);
    await loadEntries();
  };

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good morning! 🌻', icon: Sunrise };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good afternoon! ☀️', icon: Sun };
    } else if (hour >= 17 && hour < 22) {
      return { text: 'Good evening! 🌙', icon: Sunset };
    } else {
      return { text: 'Good night! ✨', icon: Moon };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 md:p-10 rounded-3xl theme-card shadow-xs">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--highlight)] text-[var(--primary-accent)] text-xs font-bold uppercase tracking-wider">
            <GreetingIcon className="w-4 h-4" />
            <span>Rollercoster</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {greeting.text}
          </h1>

          <p className="text-base text-[var(--text-secondary)] font-medium max-w-md">
            Capture your moments. Cherish your journey.
          </p>
        </div>

        <div>
          <Link
            href="/entry"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Edit3 className="w-5 h-5" />
            <span>+ New Entry</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Content Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your Previous Entries</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {entries.length === 1 ? '1 memory saved' : `${entries.length} memories saved`}
            </p>
          </div>
        </div>

        {/* Entries Grid */}
        {!isLoaded ? (
          <div className="p-12 text-center text-sm text-[var(--text-secondary)]">
            Loading your diary...
          </div>
        ) : (
          <EntryGrid entries={entries} onDeleteEntry={handleDeleteEntry} />
        )}
      </div>
    </div>
  );
}
