'use client';

import { useRouter } from 'next/navigation';

interface DateNavigatorProps {
  dateString?: string; // YYYYMMDD
}

function parseLocalDate(ds: string): Date {
  const y = parseInt(ds.slice(0, 4), 10);
  const m = parseInt(ds.slice(4, 6), 10) - 1;
  const d = parseInt(ds.slice(6, 8), 10);
  return new Date(y, m, d);
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function getTodayString(): string {
  return toDateString(new Date());
}

export function DateNavigator({ dateString }: DateNavigatorProps) {
  const router = useRouter();

  const date = dateString ? parseLocalDate(dateString) : new Date();

  const label = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  function navigate(offset: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + offset);
    const nextStr = toDateString(next);
    if (nextStr === getTodayString()) {
      router.push('/');
    } else {
      router.push(`/?date=${nextStr}`);
    }
  }

  return (
    <div className="relative flex items-center justify-center mb-1 w-full">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 text-gray-600 hover:text-gray-400 transition-colors text-base leading-none select-none"
        aria-label="Previous day"
      >
        ←
      </button>
      <p className="text-monarch-gold text-sm font-semibold uppercase tracking-widest">
        {label}
      </p>
      <button
        onClick={() => navigate(1)}
        className="absolute right-0 text-gray-600 hover:text-gray-400 transition-colors text-base leading-none select-none"
        aria-label="Next day"
      >
        →
      </button>
    </div>
  );
}
