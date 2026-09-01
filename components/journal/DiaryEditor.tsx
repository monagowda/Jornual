'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getEntryByDate,
  saveEntry,
  deleteEntry,
  DiaryEntry,
} from '@/lib/diaryStorage';
import { Save, Trash2, ArrowLeft, Check, Calendar, Clock } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

export const DiaryEditor: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial date from URL query parameter or default to today (YYYY-MM-DD)
  const initialDateParam = searchParams ? searchParams.get('date') : null;
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState<string>(initialDateParam || getTodayString());
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [entryExists, setEntryExists] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load entry for the current selected date
  const loadDateEntry = useCallback(async (targetDate: string) => {
    const existing = await getEntryByDate(targetDate);
    if (existing) {
      setTitle(existing.title || '');
      setContent(existing.content || '');
      setEntryExists(true);
      if (existing.updatedAt) {
        const timeStr = new Date(existing.updatedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setLastSavedTime(timeStr);
      }
    } else {
      setTitle('');
      setContent('');
      setEntryExists(false);
      setLastSavedTime(null);
    }
    setSaveStatus('');
  }, []);

  useEffect(() => {
    loadDateEntry(date);
  }, [date, loadDateEntry]);

  // Handle Date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setDate(newDate);
    }
  };

  // Perform Save operation
  const handleSave = async (showNotification = true) => {
    if (!date) return;
    setIsSaving(true);
    if (showNotification) setSaveStatus('Saving...');

    try {
      const saved = await saveEntry({
        date,
        title,
        content,
      });

      setEntryExists(true);
      const timeStr = new Date(saved.updatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSavedTime(timeStr);

      if (showNotification) {
        setSaveStatus('Saved ✓');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save entry:', err);
      setSaveStatus('Error saving');
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced Autosave
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only autosave if there is non-empty content
    if (!content.trim() && !title.trim()) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      handleSave(false);
      setSaveStatus('Autosaved just now ✓');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 2500);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [title, content]);

  // Delete Entry
  const handleDelete = async () => {
    await deleteEntry(date);
    setShowConfirmDelete(false);
    router.push('/');
  };

  // Format date display (e.g. September 1, 2026)
  const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl theme-card shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)] transition-colors"
            title="Return Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm font-medium">
            <Calendar className="w-4 h-4 text-[var(--primary-accent)]" />
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="bg-transparent font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-semibold text-[var(--primary-accent)] px-3 py-1 rounded-full bg-[var(--highlight)] animate-in fade-in duration-200">
              {saveStatus}
            </span>
          )}

          {entryExists && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Date Title Banner */}
      <div className="px-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {dateFormatted}
        </h2>
        {lastSavedTime && (
          <p className="text-xs text-[var(--text-secondary)] opacity-75 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 inline" />
            Last updated at {lastSavedTime}
          </p>
        )}
      </div>

      {/* Main Notebook Writing Canvas */}
      <div className="rounded-3xl theme-card p-6 md:p-10 space-y-6 shadow-sm min-h-[600px] flex flex-col">
        {/* Optional Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry Title (Optional)..."
          className="w-full text-2xl md:text-3xl font-bold bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none border-b border-transparent focus:border-[var(--border-color)] pb-2 transition-colors"
        />

        {/* Unlimited Content Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Today was a wonderful day... write as much as you want..."
          className="w-full flex-1 min-h-[450px] bg-transparent text-base md:text-lg leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:outline-none resize-none notebook-lines"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Delete Diary Entry"
        message={`Are you sure you want to delete your entry for ${date}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
};
