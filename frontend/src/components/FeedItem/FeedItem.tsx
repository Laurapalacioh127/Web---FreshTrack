import Link from 'next/link';
import type { FeedEntry } from '@/utils/feed';

interface FeedItemProps {
  entry: FeedEntry;
  highlight: boolean;
}

export const FeedItem = ({ entry, highlight }: FeedItemProps) => (
  <div
    className={`flex items-center justify-between gap-4 rounded-2xl border border-black/5 p-4 ${
      highlight ? 'bg-rose-soft/60' : 'bg-white'
    }`}
  >
    <div>
      <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs font-semibold">{entry.tag}</span>
      <p className="mt-1 font-semibold">{entry.title}</p>
      <p className="text-sm text-neutral-600">{entry.detail}</p>
    </div>
    <Link href={entry.href} className="shrink-0 text-sm font-semibold text-ops">
      {entry.actionLabel} →
    </Link>
  </div>
);