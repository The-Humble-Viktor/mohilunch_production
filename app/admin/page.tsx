import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { approveReview, rejectReview } from './actions';
import { Navbar } from '@/components/Navbar';

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30)
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

async function AdminContent() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());

  if (!user || !adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    redirect('/');
  }

  // Fetch pending reviews (bypasses RLS)
  const admin = createAdminClient();
  const { data: pending } = await admin
    .from('reviews')
    .select('id, food_slug, rating, body, created_at, anonymous, display_name, user_id')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  const reviews = pending ?? [];

  // Fetch the real email for every reviewer (admin-only, bypasses RLS on auth.users)
  const uniqueUserIds = [...new Set(reviews.map((r) => r.user_id))];
  const userEmailMap: Record<string, string> = {};
  await Promise.all(
    uniqueUserIds.map(async (uid) => {
      const { data } = await admin.auth.admin.getUserById(uid);
      if (data?.user?.email) userEmailMap[uid] = data.user.email;
    }),
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Review Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reviews.length === 0
              ? 'No pending reviews.'
              : `${reviews.length} review${reviews.length === 1 ? '' : 's'} awaiting approval`}
          </p>
        </div>
        <Link
          href="/admin/images"
          className="flex-shrink-0 px-4 py-2 rounded-lg border border-monarch-border text-gray-400 hover:border-monarch-gold hover:text-monarch-gold text-sm font-semibold transition-colors"
        >
          Manage Images →
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-monarch-border bg-monarch-surface p-10 text-center">
          <p className="text-4xl mb-3">✓</p>
          <p className="text-gray-400">All caught up! No reviews to moderate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-monarch-border bg-monarch-surface p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-mono text-monarch-gold bg-monarch-gold/10 px-2 py-0.5 rounded">
                  {review.food_slug}
                </span>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {relativeTime(review.created_at)}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < review.rating ? 'text-monarch-gold' : 'text-gray-700'}
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-500 text-sm ml-1">{review.rating}/5</span>
              </div>

              {/* Body */}
              {review.body ? (
                <p className="text-gray-300 text-sm leading-relaxed mb-3 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-monarch-border">
                  {review.body}
                </p>
              ) : (
                <p className="text-gray-600 text-sm italic mb-3">No written review</p>
              )}

              {/* Author */}
              <p className="text-xs text-gray-600 mb-4">
                By:{' '}
                <span className="text-gray-400">
                  {review.anonymous || !review.display_name ? 'Anonymous' : review.display_name}
                </span>
                {review.anonymous && userEmailMap[review.user_id] && (
                  <span className="ml-2 text-yellow-600">
                    (real: {userEmailMap[review.user_id]})
                  </span>
                )}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <form
                  action={async () => {
                    'use server';
                    await approveReview(review.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                  >
                    Approve
                  </button>
                </form>
                <form
                  action={async () => {
                    'use server';
                    await rejectReview(review.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white text-sm font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function AdminSkeleton() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-9 w-64 bg-monarch-surface rounded mb-2" />
      <div className="h-4 w-40 bg-monarch-surface rounded mb-8" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-monarch-surface border border-monarch-border" />
        ))}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-monarch-black">
      <Navbar />
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent />
      </Suspense>
    </div>
  );
}
