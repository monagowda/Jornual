'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  DEFAULT_PALETTE,
  DARK_PALETTE,
  getPreferences,
  savePreferences as persistPreferences,
  CustomPalette,
} from '@/lib/diaryStorage';

interface ThemeContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPaletteToDefault: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: async () => {},
  resetPaletteToDefault: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getPreferences().then((prefs) => {
      setPreferences(prefs);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;

    // 1. Theme mode resolution (light / dark / system)
    let isDark = false;
    if (preferences.themeMode === 'dark') {
      isDark = true;
    } else if (preferences.themeMode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Palette resolution
    let activePalette: CustomPalette;
    if (preferences.paletteType === 'custom' && preferences.customPalette) {
      activePalette = preferences.customPalette;
    } else {
      activePalette = isDark ? DARK_PALETTE : DEFAULT_PALETTE;
    }

    root.style.setProperty('--bg-primary', activePalette.background);
    root.style.setProperty('--bg-card', activePalette.cardBg);
    root.style.setProperty('--text-primary', activePalette.text);
    root.style.setProperty('--primary-accent', activePalette.primary);
    root.style.setProperty('--secondary-accent', activePalette.accent);
    root.style.setProperty('--highlight', activePalette.highlight);
    root.style.setProperty(
      '--border-color',
      isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(124, 58, 237, 0.12)'
    );

    // 3. Typography resolution
    let fontStack = 'var(--font-sans), system-ui, sans-serif';
    if (preferences.fontFamily === 'serif') {
      fontStack = 'Georgia, Cambria, "Times New Roman", Times, serif';
    } else if (preferences.fontFamily === 'mono') {
      fontStack = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    } else if (preferences.fontFamily === 'handwriting') {
      fontStack = '"Caveat", "Comic Sans MS", "Dancing Script", cursive';
    }
    root.style.setProperty('--font-family', fontStack);

    let fontSizeBase = '16px';
    if (preferences.fontSize === 'sm') fontSizeBase = '14px';
    if (preferences.fontSize === 'lg') fontSizeBase = '18px';
    if (preferences.fontSize === 'xl') fontSizeBase = '20px';
    root.style.setProperty('--font-size-base', fontSizeBase);

  }, [preferences, isLoaded]);

  // Handle system theme changes dynamically
  useEffect(() => {
    if (preferences.themeMode !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setPreferences((prev) => ({ ...prev }));
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.themeMode]);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    await persistPreferences(updated);
  };

  const resetPaletteToDefault = async () => {
    const updated: UserPreferences = {
      ...preferences,
      paletteType: 'default',
      customPalette: DEFAULT_PALETTE,
    };
    setPreferences(updated);
    await persistPreferences(updated);
  };

  return (
    <ThemeContext.Provider value={{ preferences, updatePreferences, resetPaletteToDefault }}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
