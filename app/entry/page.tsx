'use client';

import React, { Suspense } from 'react';
import { DiaryEditor } from '@/components/journal/DiaryEditor';

export default function EntryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--text-secondary)]">Loading editor...</div>}>
      <DiaryEditor />
    </Suspense>
  );
}
