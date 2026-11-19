import type { DonationStatus } from '@/types';

const styles: Record<DonationStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-sun' },
  approved: { label: 'Aprobada', className: 'bg-ops-soft text-ops' },
  completed: { label: 'Completada', className: 'bg-brand-soft text-brand-dark' },
};

export const DonationStatusBadge = ({ status }: { status: DonationStatus }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status].className}`}>
    {styles[status].label}
  </span>
);