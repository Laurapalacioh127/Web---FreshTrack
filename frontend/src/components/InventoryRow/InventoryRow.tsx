import Link from 'next/link';
import type { InventoryItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { Thumb } from '@/components/Thumb/Thumb';

export const InventoryRow = ({ item }: { item: InventoryItem }) => (
  <Link
    href={`/user/inventory/${item.id}`}
    className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4"
  >
    <Thumb name={item.name} category={item.category} />
    <div className="flex flex-1 flex-col gap-1">
      <StatusBadge status={item.status} expiresInDays={item.expiresInDays} />
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-neutral-600">{item.quantity}</p>
    </div>
    <span aria-hidden="true">→</span>
  </Link>
);