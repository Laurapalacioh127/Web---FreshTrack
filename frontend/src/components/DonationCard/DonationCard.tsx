import type { Donation } from '@/types';
import { getInitials } from '@/utils/format';
import { DonationStatusBadge } from '@/components/DonationStatusBadge/DonationStatusBadge';

export const DonationCard = ({ donation }: { donation: Donation }) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sun text-sm font-semibold">
        {getInitials(donation.donorName)}
      </span>
      <div className="flex-1">
        <p className="font-semibold">{donation.donorName}</p>
        <p className="text-xs text-neutral-600">{donation.zone}</p>
      </div>
      <DonationStatusBadge status={donation.status} />
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl bg-cream p-3">
        <p className="text-xs text-neutral-500">Alimentos para donar</p>
        <p className="font-semibold">{donation.items}</p>
      </div>
      <div className="rounded-xl bg-cream p-3">
        <p className="text-xs text-neutral-500">Fecha de vencimiento</p>
        <p className="font-semibold">{donation.expiresLabel}</p>
      </div>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <button type="button" className="rounded-lg bg-brand shadow-glow-brand transition hover:-translate-y-0.5 py-2.5 text-sm font-semibold text-white">
        Contactar por WhatsApp
      </button>
      <button type="button" className="rounded-lg border border-black/10 py-2.5 text-sm font-semibold">
        Aprobar/Cambiar estado
      </button>
    </div>
  </article>
);