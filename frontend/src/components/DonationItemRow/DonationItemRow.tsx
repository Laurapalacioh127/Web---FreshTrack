import type { InventoryItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { Thumb } from '@/components/Thumb/Thumb';

export const DonationItemRow = ({ item }: { item: InventoryItem }) => (
  <div className="flex items-center gap-3">
    <Thumb name={item.name} category={item.category} />
    <div className="flex-1">
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs text-neutral-600">{item.quantity}</p>
    </div>
    <StatusBadge status={item.status} expiresInDays={item.expiresInDays} />
  </div>
);