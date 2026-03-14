'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-monarch-border bg-monarch-black/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="MohiLunch home"
        >
          <span className="text-xl font-bold text-monarch-gold tracking-tight group-hover:text-monarch-gold-light transition-colors">
            MohiLunch
          </span>
          <span className="hidden sm:inline text-xs text-gray-500 font-normal mt-0.5">
            Monarch High School
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {loading ? (
            <div className="w-16 h-7 rounded bg-monarch-surface animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-400 truncate max-w-[160px]">
                {user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm px-3 py-1.5 rounded border border-monarch-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm px-3 py-1.5 rounded bg-monarch-gold text-monarch-black font-semibold hover:bg-monarch-gold-light transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
