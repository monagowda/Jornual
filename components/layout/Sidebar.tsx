'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Edit3, Settings, Menu, X, BookOpen } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'New Entry', href: '/entry', icon: Edit3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen p-6 border-r border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 sticky top-0 h-screen transition-colors duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Rollercoster
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">Personal Daily Diary</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active
                    ? 'text-[var(--text-primary)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)]'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: 'var(--highlight)',
                        color: 'var(--primary-accent)',
                      }
                    : {}
                }
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? 'text-[var(--primary-accent)]' : 'text-[var(--text-secondary)]'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick New Entry Button */}
        <div className="pt-6 border-t border-[var(--border-color)]">
          <Link
            href="/entry"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Edit3 className="w-4 h-4" />
            <span>+ Write Today</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] sticky top-0 z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)]">Rollercoster</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/entry"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
            style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>+ New</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--highlight)] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[var(--bg-card)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--primary-accent)' }}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[var(--text-primary)]">Rollercoster</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--highlight)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium text-base transition-all ${
                    active
                      ? 'font-bold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--highlight)]'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: 'var(--highlight)',
                          color: 'var(--primary-accent)',
                        }
                      : {}
                  }
                >
                  <Icon
                    className={`w-6 h-6 ${
                      active ? 'text-[var(--primary-accent)]' : 'text-[var(--text-secondary)]'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-[var(--border-color)]">
            <Link
              href="/entry"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-white font-semibold text-base shadow-md"
              style={{ backgroundColor: 'var(--primary-accent)' }}
            >
              <Edit3 className="w-5 h-5" />
              <span>+ New Entry</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
