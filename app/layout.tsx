import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/themeContext';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Rollercoster — Simple Personal Daily Diary',
  description: 'A simple, beautiful, minimal, and responsive personal digital diary.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
