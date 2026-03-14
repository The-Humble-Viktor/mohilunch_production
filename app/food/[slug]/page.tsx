import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MENU_MAP, MenuItem } from '@/lib/menuMap';
import { toSlug } from '@/lib/slug';
import { TagBadge } from '@/components/TagBadge';
import { StarRatingDisplay } from '@/components/StarRating';
import { ReviewForm } from '@/components/ReviewForm';
import { Navbar } from '@/components/Navbar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findMenuItemBySlug(slug: string): MenuItem | null {
  for (const item of Object.values(MENU_MAP)) {
    if (toSlug(item.displayName) === slug) {
      return item;
    }
  }
  return null;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30)
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// ── Full page content (async, inside Suspense) ────────────────────────────────

async function FoodContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findMenuItemBySlug(slug);

  if (!item) notFound();

  const supabase = await createClient();

  const [{ data: reviews }, { data: { user } }, { data: imageRow }] = await Promise.all([
    supabase
      .from('reviews')
      .select('id, rating, body, created_at, user_id, anonymous, display_name')
      .eq('food_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
    supabase
      .from('menu_item_images')
      .select('storage_path')
      .eq('slug', slug)
      .maybeSingle(),
  ]);

  const imageUrl = imageRow?.storage_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-images/${imageRow.storage_path}`
    : null;

  const userDisplayName: string =
    (user?.user_metadata?.['full_name'] as string) ||
    (user?.user_metadata?.['name'] as string) ||
    (user?.email as string) ||
    'Student';

  const safeReviews = reviews ?? [];

  const avgRating =
    safeReviews.length > 0
      ? safeReviews.reduce((sum, r) => sum + r.rating, 0) / safeReviews.length
      : null;

  const topTags = item.isAlternative
    ? Array.from(new Set(item.options?.flatMap((o) => o.tags) ?? []))
    : (item.tags ?? []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-monarch-gold transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to today's menu
      </Link>

      {/* Food header */}
      <div className="mb-6">
        {/* Hero image */}
        {imageUrl && (
          <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden mb-5 bg-[#111]">
            <Image
              src={imageUrl}
              alt={item.displayName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="flex flex-wrap items-start gap-3 mb-3">
          <h1 className="text-3xl font-bold text-white">{item.displayName}</h1>
          {item.isAlternative && (
            <span className="mt-1 text-xs px-2 py-0.5 rounded-full border border-monarch-gold/40 text-monarch-gold">
              Choice
            </span>
          )}
        </div>

        {/* Tags */}
        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {topTags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Rating summary */}
        {avgRating !== null ? (
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={avgRating} size="md" />
            <span className="text-gray-400 text-sm">
              {avgRating.toFixed(1)} · {safeReviews.length}{' '}
              {safeReviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        ) : (
          <span className="text-gray-600 text-sm italic">
            No reviews yet — be the first!
          </span>
        )}
      </div>

      {/* Item detail card */}
      <div className="rounded-xl border border-monarch-border bg-monarch-surface p-5 mb-8">
        {item.isAlternative && item.options ? (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">
              Options
            </p>
            {item.options.map((option, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-medium">{option.name}</span>
                  {option.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
                {option.subItems.length > 0 && (
                  <p className="text-sm text-gray-500 pl-1">
                    with{' '}
                    {option.subItems.map((s, si) => (
                      <span key={si}>
                        {si > 0 && ', '}
                        {s.name}
                        {s.tags.length > 0 && (
                          <span className="inline-flex gap-1 ml-1">
                            {s.tags.map((t) => (
                              <TagBadge key={t} tag={t} />
                            ))}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                )}
                {i < (item.options?.length ?? 0) - 1 && (
                  <div className="border-t border-monarch-border mt-2 pt-2" />
                )}
              </div>
            ))}
          </div>
        ) : item.subItems && item.subItems.length > 0 ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">
              Served with
            </p>
            <div className="space-y-2">
              {item.subItems.map((sub, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-monarch-gold flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{sub.name}</span>
                  {sub.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No additional details available.
          </p>
        )}
      </div>

      {/* Review form */}
      <div className="mb-10">
        {user ? (
          <ReviewForm slug={slug} userId={user.id} userDisplayName={userDisplayName} />
        ) : (
          <div className="rounded-xl border border-monarch-border bg-monarch-surface p-6 text-center">
            <p className="text-gray-400 mb-3">Sign in to leave a review</p>
            <Link
              href="/auth/login"
              className="inline-block px-5 py-2.5 rounded-lg bg-monarch-gold text-monarch-black font-semibold text-sm hover:bg-monarch-gold-light transition-colors"
            >
              Sign in with Google
            </Link>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Reviews{' '}
          {safeReviews.length > 0 && (
            <span className="text-gray-600 font-normal text-base">
              ({safeReviews.length})
            </span>
          )}
        </h2>

        {safeReviews.length === 0 ? (
          <p className="text-gray-600 text-sm italic py-6 text-center">
            No reviews yet. Be the first to rate this item!
          </p>
        ) : (
          <div className="space-y-4">
            {safeReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-monarch-border bg-monarch-surface p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <StarRatingDisplay rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-600 flex-shrink-0">
                    {relativeTime(review.created_at)}
                  </span>
                </div>

                {review.body && (
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {review.body}
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-2">
                  {review.anonymous || !review.display_name ? 'Anonymous' : review.display_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ── Page shell (synchronous, no data access) ──────────────────────────────────

export default function FoodPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-monarch-black">
      <Navbar />
      <Suspense fallback={<FoodSkeleton />}>
        <FoodContent params={params} />
      </Suspense>
    </div>
  );
}

function FoodSkeleton() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-4 w-36 bg-monarch-surface rounded mb-6" />
      <div className="h-9 w-64 bg-monarch-surface rounded mb-4" />
      <div className="flex gap-2 mb-6">
        <div className="h-5 w-10 bg-monarch-surface rounded" />
        <div className="h-5 w-10 bg-monarch-surface rounded" />
      </div>
      <div className="h-32 rounded-xl bg-monarch-surface border border-monarch-border mb-8" />
      <div className="h-28 rounded-xl bg-monarch-surface border border-monarch-border mb-8" />
      <div className="h-5 w-24 bg-monarch-surface rounded mb-4" />
      <div className="space-y-3">
        <div className="h-20 rounded-xl bg-monarch-surface border border-monarch-border" />
      </div>
    </main>
  );
}
