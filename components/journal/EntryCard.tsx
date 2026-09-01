'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DiaryEntry } from '@/lib/diaryStorage';
import { Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface EntryCardProps {
  entry: DiaryEntry;
  onDelete: (date: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Format date parts
  // entry.date is YYYY-MM-DD
  const dateObj = new Date(entry.date + 'T00:00:00');
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const year = dateObj.getFullYear();

  // Create preview snippet (first 140 chars)
  const snippet =
    entry.content.length > 140 ? entry.content.substring(0, 140) + '...' : entry.content;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete(entry.date);
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between p-6 rounded-3xl theme-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link href={`/entry?date=${entry.date}`} className="block flex-1">
          {/* Card Header: Date & Day Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl text-white font-bold min-w-[56px] shadow-xs"
                style={{ backgroundColor: 'var(--primary-accent)' }}
              >
                <span className="text-lg leading-none">{dayNum}</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90 mt-0.5">
                  {monthName}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                  {dayOfWeek}
                </span>
                <span className="text-xs text-[var(--text-secondary)] opacity-75">{year}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-1 group-hover:text-[var(--primary-accent)] transition-colors">
            {entry.title || 'Untitled Entry'}
          </h3>

          {/* Content Preview Snippet */}
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed whitespace-pre-line mb-4">
            {snippet || 'No text written...'}
          </p>
        </Link>

        {/* Footer info */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5 opacity-70" />
            {entry.date}
          </span>
          <Link
            href={`/entry?date=${entry.date}`}
            className="font-medium text-[var(--primary-accent)] hover:underline flex items-center gap-1"
          >
            Read / Edit
            <Edit2 className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Diary Entry"
        message={`Are you sure you want to delete your entry for ${entry.date}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
