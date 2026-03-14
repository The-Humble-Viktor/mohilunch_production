interface Deal {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
}

interface DealsBannerProps {
  deals: Deal[];
}

export function DealsBanner({ deals }: DealsBannerProps) {
  if (deals.length === 0) return null;

  return (
    <div className="w-full bg-monarch-gold border-b border-monarch-gold-dark">
      <div className="relative overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-full justify-center">
          <div className="flex-shrink-0 flex items-center px-4 py-2.5 bg-monarch-gold-dark">
            <span className="text-xs font-bold text-monarch-black uppercase tracking-widest whitespace-nowrap">
              Today's Deals
            </span>
          </div>
          <div className="flex items-center gap-4 px-4 py-2.5 overflow-x-auto scrollbar-none">
            {deals.map((deal, index) => (
              <div key={deal.id} className="flex items-center gap-4 flex-shrink-0">
                {index > 0 && (
                  <span className="text-monarch-gold-dark font-bold">·</span>
                )}
                {deal.url ? (
                  <a
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group"
                  >
                    <span className="font-semibold text-monarch-black text-sm group-hover:underline">
                      {deal.title}
                    </span>
                    {deal.description && (
                      <span className="text-monarch-black/70 text-sm">
                        — {deal.description}
                      </span>
                    )}
                    <svg
                      className="w-3.5 h-3.5 text-monarch-black/60 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-monarch-black text-sm">
                      {deal.title}
                    </span>
                    {deal.description && (
                      <span className="text-monarch-black/70 text-sm">
                        — {deal.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
