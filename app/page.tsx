import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getTodaysMenu } from '@/lib/ics';
import { Navbar } from '@/components/Navbar';
import { DealsBanner } from '@/components/DealsBanner';
import { MenuItemCard } from '@/components/MenuItemCard';
import { DateNavigator } from '@/components/DateNavigator';

// ── Data-fetching layer (runs inside Suspense) ────────────────────────────────

async function HomeContent({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: rawDate } = await searchParams;
  const date = rawDate && /^\d{8}$/.test(rawDate) ? rawDate : undefined;
  const supabase = await createClient();

  const [menuItems, ratingsResult, dealsResult] = await Promise.all([
    getTodaysMenu(date),
    supabase
      .from('reviews')
      .select('food_slug, rating')
      .eq('status', 'approved')
      .then(({ data }) => data ?? []),
    supabase
      .from('deals')
      .select('id, title, description, url')
      .eq('active', true)
      .then(({ data }) => data ?? []),
  ]);

  const ratingMap: Record<string, { sum: number; count: number }> = {};
  for (const row of ratingsResult) {
    if (!ratingMap[row.food_slug]) {
      ratingMap[row.food_slug] = { sum: 0, count: 0 };
    }
    ratingMap[row.food_slug].sum += row.rating;
    ratingMap[row.food_slug].count += 1;
  }

  const entrees = menuItems.filter((m) => m.item.category === 'entree');
  const sides = menuItems.filter((m) => m.item.category === 'side');

  const todayStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  })();
  const isToday = !date || date === todayStr;

  return (
    <>
      <DealsBanner deals={dealsResult} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <DateNavigator dateString={date} />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {isToday ? "Today's Lunch" : 'Lunch Menu'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Monarch High School · BVSD
          </p>
        </div>

        {menuItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-10">
            {entrees.length > 0 && (
              <section>
                <SectionHeading label="Entrees" count={entrees.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entrees.map(({ item, slug }) => {
                    const agg = ratingMap[slug];
                    return (
                      <MenuItemCard
                        key={slug}
                        item={item}
                        slug={slug}
                        avgRating={agg ? agg.sum / agg.count : undefined}
                        reviewCount={agg?.count ?? 0}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {sides.length > 0 && (
              <section>
                <SectionHeading label="Sides" count={sides.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sides.map(({ item, slug }) => {
                    const agg = ratingMap[slug];
                    return (
                      <MenuItemCard
                        key={slug}
                        item={item}
                        slug={slug}
                        avgRating={agg ? agg.sum / agg.count : undefined}
                        reviewCount={agg?.count ?? 0}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-monarch-border mt-20 py-8 text-center">
        <p className="text-xs text-gray-600">
          MohiLunch &mdash; Monarch High School &middot; Menu data from BVSD calendar feeds
        </p>
      </footer>
    </>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  return (
    <div className="min-h-screen bg-monarch-black">
      <Navbar />
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-lg font-semibold text-white">{label}</h2>
      <span className="text-xs px-2 py-0.5 rounded-full bg-monarch-surface border border-monarch-border text-gray-500">
        {count}
      </span>
      <div className="flex-1 h-px bg-monarch-border" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🍽️</div>
      <h2 className="text-xl font-semibold text-white mb-2">No menu today</h2>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">
        It looks like there's no lunch scheduled today — it might be a weekend,
        holiday, or the calendar hasn't been updated yet. Check back later!
      </p>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="mb-10">
        <div className="h-4 w-40 bg-monarch-surface rounded mb-2" />
        <div className="h-9 w-56 bg-monarch-surface rounded mb-2" />
        <div className="h-4 w-36 bg-monarch-surface rounded" />
      </div>
      <div className="h-5 w-24 bg-monarch-surface rounded mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-monarch-surface border border-monarch-border" />
        ))}
      </div>
    </main>
  );
}
