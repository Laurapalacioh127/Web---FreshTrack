import type { DonationStatus } from '@/types';

const styles: Record<DonationStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-sun' },
  accepted: { label: 'Aceptada', className: 'bg-brand-soft text-brand-dark' },
  rejected: { label: 'Rechazada', className: 'bg-rose-soft text-rose-900' },
};

export const DonationStatusBadge = ({ status }: { status: DonationStatus }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status].className}`}>
    {styles[status].label}
  </span>
);