import Link from 'next/link';
import { MenuItem } from '@/lib/menuMap';
import { TagBadge } from './TagBadge';
import { StarRatingDisplay } from './StarRating';

interface MenuItemCardProps {
  item: MenuItem;
  slug: string;
  avgRating?: number;
  reviewCount?: number;
}

export function MenuItemCard({
  item,
  slug,
  avgRating,
  reviewCount = 0,
}: MenuItemCardProps) {
  // Collect all top-level tags for display
  const topTags = item.isAlternative
    ? Array.from(
        new Set(item.options?.flatMap((o) => o.tags) ?? []),
      )
    : (item.tags ?? []);

  return (
    <Link
      href={`/food/${slug}`}
      className="group block rounded-xl border border-monarch-border bg-monarch-surface p-4 sm:p-5 hover:border-monarch-gold/50 hover:bg-[#1a1a1a] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-monarch-gold"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-semibold text-base sm:text-lg leading-tight group-hover:text-monarch-gold-light transition-colors">
          {item.displayName}
        </h3>
        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
            {topTags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        {reviewCount > 0 && avgRating != null ? (
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={avgRating} size="sm" />
            <span className="text-xs text-gray-500">
              {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-600 italic">No reviews yet</span>
        )}
      </div>

      {/* Content: sub-items or alternatives */}
      {item.isAlternative && item.options ? (
        <div className="space-y-2">
          {item.options.map((option, i) => (
            <div key={i} className="flex items-start gap-2">
              {i > 0 && (
                <span className="text-xs text-monarch-gold font-semibold mt-0.5 flex-shrink-0">
                  or
                </span>
              )}
              <div className={i > 0 ? '' : ''}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm text-gray-300">{option.name}</span>
                  {option.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
                {option.subItems.length > 0 && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    with {option.subItems.map((s) => s.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : item.subItems && item.subItems.length > 0 ? (
        <p className="text-sm text-gray-500">
          with {item.subItems.map((s) => s.name).join(', ')}
        </p>
      ) : null}

      {/* Footer cue */}
      <div className="mt-4 flex items-center gap-1 text-xs text-gray-600 group-hover:text-monarch-gold/70 transition-colors">
        <span>View reviews</span>
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
