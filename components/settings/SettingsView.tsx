'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/providers/themeContext';
import {
  exportDiaryData,
  importDiaryData,
  DEFAULT_PALETTE,
  DARK_PALETTE,
  CustomPalette,
} from '@/lib/diaryStorage';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Download,
  Upload,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, resetPaletteToDefault } = useTheme();

  const [importStatus, setImportStatus] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  // Handle export JSON
  const handleExport = async () => {
    try {
      const jsonStr = await exportDiaryData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `rollercoster-diary-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Handle import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('');
    setImportError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const result = await importDiaryData(content);
        setImportStatus(`Successfully restored ${result.imported} new entries and updated ${result.updated} entries!`);
        setTimeout(() => setImportStatus(''), 5000);
      } catch (err: any) {
        setImportError(err.message || 'Failed to import backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Custom palette changes
  const handleCustomColorChange = (key: keyof CustomPalette, value: string) => {
    const currentCustom = preferences.customPalette || DEFAULT_PALETTE;
    const updatedCustom = { ...currentCustom, [key]: value };
    updatePreferences({
      paletteType: 'custom',
      customPalette: updatedCustom,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Customize your notebook theme, typography, and local backups.
        </p>
      </div>

      {/* 1. Appearance (Theme Mode) */}
      <section className="p-6 md:p-8 rounded-3xl theme-card shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Appearance</h2>
            <p className="text-xs text-[var(--text-secondary)]">Choose your preferred light or dark view</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { mode: 'light', label: 'Light', icon: Sun },
            { mode: 'dark', label: 'Dark', icon: Moon },
            { mode: 'system', label: 'System', icon: Monitor },
          ].map(({ mode, label, icon: Icon }) => {
            const isSelected = preferences.themeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => updatePreferences({ themeMode: mode as any })}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[var(--primary-accent)] bg-[var(--highlight)] text-[var(--primary-accent)] font-bold shadow-xs'
                    : 'border-[var(--border-color)] hover:bg-[var(--highlight)]/50 text-[var(--text-secondary)]'
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Color Palette */}
      <section className="p-6 md:p-8 rounded-3xl theme-card shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--primary-accent)' }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Color Palette</h2>
              <p className="text-xs text-[var(--text-secondary)]">Select a theme palette or personalize your colors</p>
            </div>
          </div>

          {preferences.paletteType === 'custom' && (
            <button
              onClick={resetPaletteToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          )}
        </div>

        {/* Palette mode options */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => updatePreferences({ paletteType: 'default' })}
            className={`px-5 py-3 rounded-2xl font-semibold text-sm border flex items-center gap-3 transition-all ${
              preferences.paletteType === 'default'
                ? 'border-[var(--primary-accent)] bg-[var(--highlight)] text-[var(--primary-accent)] shadow-xs'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--highlight)]/40'
            }`}
          >
            <span>Default Soft Pastel</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#DDD6FE]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#FAF8F5]" />
            </div>
          </button>

          <button
            onClick={() => updatePreferences({ paletteType: 'custom' })}
            className={`px-5 py-3 rounded-2xl font-semibold text-sm border flex items-center gap-3 transition-all ${
              preferences.paletteType === 'custom'
                ? 'border-[var(--primary-accent)] bg-[var(--highlight)] text-[var(--primary-accent)] shadow-xs'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--highlight)]/40'
            }`}
          >
            <span>Custom Palette</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary-accent)] text-white">
              + Custom
            </span>
          </button>
        </div>

        {/* Custom Color Pickers */}
        {preferences.paletteType === 'custom' && (
          <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Custom Accent & Background Pickers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Primary Accent', key: 'primary' as const },
                { label: 'Secondary Accent', key: 'accent' as const },
                { label: 'Background Color', key: 'background' as const },
                { label: 'Card Background', key: 'cardBg' as const },
                { label: 'Text Color', key: 'text' as const },
                { label: 'Highlight Tint', key: 'highlight' as const },
              ].map(({ label, key }) => {
                const currentColor =
                  (preferences.customPalette && preferences.customPalette[key]) ||
                  DEFAULT_PALETTE[key];
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleCustomColorChange(key, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                        {currentColor}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. Typography */}
      <section className="p-6 md:p-8 rounded-3xl theme-card shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Typography</h2>
            <p className="text-xs text-[var(--text-secondary)]">Customize font family and text sizing</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Font Family */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
              Font Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'sans', name: 'Clean Sans', style: 'font-sans' },
                { id: 'serif', name: 'Classic Serif', style: 'font-serif' },
                { id: 'mono', name: 'Minimal Mono', style: 'font-mono' },
                { id: 'handwriting', name: 'Handwriting', style: 'font-cursive' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => updatePreferences({ fontFamily: f.id as any })}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all ${
                    preferences.fontFamily === f.id
                      ? 'border-[var(--primary-accent)] bg-[var(--highlight)] text-[var(--primary-accent)] font-bold shadow-xs'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--highlight)]/40'
                  }`}
                >
                  <span className="text-sm block">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
              Writing Size
            </label>
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {[
                { id: 'sm', label: 'Small' },
                { id: 'md', label: 'Medium' },
                { id: 'lg', label: 'Large' },
                { id: 'xl', label: 'Extra Large' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => updatePreferences({ fontSize: s.id as any })}
                  className={`py-2.5 px-2 rounded-2xl border text-center text-xs font-semibold transition-all ${
                    preferences.fontSize === s.id
                      ? 'border-[var(--primary-accent)] bg-[var(--highlight)] text-[var(--primary-accent)] shadow-xs'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--highlight)]/40'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Backup & Restore */}
      <section className="p-6 md:p-8 rounded-3xl theme-card shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Backup & Restore</h2>
            <p className="text-xs text-[var(--text-secondary)]">Export your diary data or restore from JSON</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Download className="w-4 h-4" />
            <span>Export Diary (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-semibold text-sm text-[var(--text-primary)] cursor-pointer hover:bg-[var(--highlight)] transition-colors shadow-xs">
            <Upload className="w-4 h-4 text-[var(--primary-accent)]" />
            <span>Import Diary Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {importStatus && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {importError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Local Storage Disclaimer Note */}
        <div className="p-4 rounded-2xl bg-[var(--highlight)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[var(--primary-accent)]" />
            Important Storage Notice:
          </p>
          <p className="text-[var(--text-secondary)]">
            "Your diary is stored locally in this browser. Export your diary regularly to keep a backup."
          </p>
        </div>
      </section>
    </div>
  );
};
