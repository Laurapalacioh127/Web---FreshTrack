import type { InventoryStatus } from '@/types';
import { formatExpiry } from '@/utils/format';

const styles: Record<InventoryStatus, string> = {
  ok: 'bg-brand-soft text-brand-dark',
  soon: 'bg-sun text-amber-900',
  expired: 'bg-rose-soft text-rose-900',
};

interface StatusBadgeProps {
  status: InventoryStatus;
  expiresInDays: number;
}

export const StatusBadge = ({ status, expiresInDays }: StatusBadgeProps) => (
  <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${styles[status]}`}>
    {formatExpiry(expiresInDays)}
  </span>
);