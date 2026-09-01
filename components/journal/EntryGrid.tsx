'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DiaryEntry } from '@/lib/diaryStorage';
import { EntryCard } from './EntryCard';
import { Search, Sparkles, Edit3 } from 'lucide-react';

interface EntryGridProps {
  entries: DiaryEntry[];
  onDeleteEntry: (date: string) => void;
}

export const EntryGrid: React.FC<EntryGridProps> = ({ entries, onDeleteEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.date.includes(q)
    );
  });

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 my-8 rounded-3xl theme-card text-center space-y-6 max-w-lg mx-auto shadow-sm">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg animate-bounce"
          style={{ backgroundColor: 'var(--primary-accent)' }}
        >
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your story starts here.</h2>
          <p className="text-base text-[var(--text-secondary)]">
            You haven't written anything yet. Start capturing your moments today.
          </p>
        </div>
        <Link
          href="/entry"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          style={{ backgroundColor: 'var(--primary-accent)' }}
        >
          <Edit3 className="w-5 h-5" />
          <span>+ Write Your First Entry</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optional Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search diary entries..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/50 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Clear
          </button>
        )}
      </div>

      {filteredEntries.length === 0 ? (
        <div className="p-8 text-center rounded-2xl theme-card space-y-3">
          <p className="text-base text-[var(--text-secondary)] font-medium">
            No entries found matching "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm font-semibold text-[var(--primary-accent)] hover:underline"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.date} entry={entry} onDelete={onDeleteEntry} />
          ))}
        </div>
      )}
    </div>
  );
};
