import Link from 'next/link';
import type { InventoryItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';

export const ExpiringItemCard = ({ item }: { item: InventoryItem }) => (
  <Link
    href={`/user/inventory/${item.id}`}
    className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-4"
  >
    <StatusBadge status={item.status} expiresInDays={item.expiresInDays} />
    <p className="font-medium">{item.name}</p>
    <p className="text-sm text-neutral-600">{item.quantity}</p>
  </Link>
);