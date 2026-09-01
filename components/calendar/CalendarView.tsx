'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDatesWithEntries, getEntryByDate, DiaryEntry } from '@/lib/diaryStorage';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3, Sparkles } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [loadingSelected, setLoadingSelected] = useState(false);

  // Helper to format date to YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const loadDates = async () => {
    const dates = await getDatesWithEntries();
    setEntryDates(new Set(dates));
  };

  useEffect(() => {
    loadDates();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Month grid calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    const todayStr = formatDateString(now.getFullYear(), now.getMonth(), now.getDate());
    handleSelectDate(todayStr);
  };

  const handleSelectDate = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setLoadingSelected(true);
    const entry = await getEntryByDate(dateStr);
    setSelectedEntry(entry);
    setLoadingSelected(false);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days grid construction
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ key: `blank-${i}`, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateString(year, month, day);
    calendarCells.push({
      key: dateStr,
      day,
      dateStr,
      isCurrentMonth: true,
      hasEntry: entryDates.has(dateStr),
    });
  }

  const todayStr = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl theme-card shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{monthName}</h2>
            <p className="text-xs text-[var(--text-secondary)]">Browse diary entries by date</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--primary-accent)] bg-[var(--highlight)] hover:brightness-95 transition-all"
          >
            Today
          </button>
          <div className="flex items-center border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-primary)]">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-6 bg-[var(--border-color)]" />
            <button
              onClick={handleNextMonth}
              className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)] transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="p-6 md:p-8 rounded-3xl theme-card shadow-sm space-y-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((wd) => (
            <div
              key={wd}
              className="py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {calendarCells.map((cell) => {
            if (!cell.isCurrentMonth) {
              return <div key={cell.key} className="h-16 md:h-20 rounded-2xl opacity-20 bg-transparent" />;
            }

            const isSelected = selectedDate === cell.dateStr;
            const isToday = cell.dateStr === todayStr;

            return (
              <button
                key={cell.key}
                onClick={() => handleSelectDate(cell.dateStr!)}
                className={`relative h-16 md:h-20 p-2 rounded-2xl flex flex-col justify-between items-center transition-all duration-200 border ${
                  isSelected
                    ? 'ring-2 ring-[var(--primary-accent)] shadow-md border-transparent bg-[var(--highlight)]'
                    : isToday
                    ? 'border-[var(--primary-accent)] bg-[var(--bg-primary)]'
                    : 'border-transparent hover:bg-[var(--highlight)]/50'
                }`}
              >
                <span
                  className={`text-sm md:text-base font-semibold ${
                    isToday ? 'text-[var(--primary-accent)] font-bold' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {cell.day}
                </span>

                {cell.hasEntry && (
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-xs mb-1 animate-in zoom-in"
                    style={{ backgroundColor: 'var(--primary-accent)' }}
                    title="Diary Entry Recorded"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail Drawer / Panel */}
      {selectedDate && (
        <div className="p-6 rounded-3xl theme-card shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Selected Date
              </span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>

            {selectedEntry && (
              <Link
                href={`/entry?date=${selectedDate}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: 'var(--primary-accent)' }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open / Edit</span>
              </Link>
            )}
          </div>

          {loadingSelected ? (
            <p className="text-sm text-[var(--text-secondary)] py-4">Loading date info...</p>
          ) : selectedEntry ? (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-[var(--text-primary)]">
                {selectedEntry.title || 'Untitled Entry'}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 whitespace-pre-line">
                {selectedEntry.content}
              </p>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">No diary entry for this day.</p>
              <Link
                href={`/entry?date=${selectedDate}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--primary-accent)' }}
              >
                <Edit3 className="w-4 h-4" />
                <span>+ Create Entry</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
