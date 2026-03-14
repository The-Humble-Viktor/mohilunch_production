import { MenuTag } from '@/lib/menuMap';

interface TagBadgeProps {
  tag: MenuTag;
}

const TAG_CONFIG: Record<MenuTag, { label: string; className: string }> = {
  GF: {
    label: 'GF',
    className: 'bg-violet-900 text-violet-300',
  },
  DF: {
    label: 'DF',
    className: 'bg-sky-900 text-sky-300',
  },
  V: {
    label: 'V',
    className: 'bg-emerald-900 text-emerald-300',
  },
  GF_AVAIL: {
    label: 'GF avail',
    className: 'bg-violet-950 text-violet-400 border border-violet-800',
  },
  DF_AVAIL: {
    label: 'DF avail',
    className: 'bg-sky-950 text-sky-400 border border-sky-800',
  },
};

export function TagBadge({ tag }: TagBadgeProps) {
  const config = TAG_CONFIG[tag];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
