import type { Donation } from '@/types';
import { getInitials } from '@/utils/format';
import { DonationStatusBadge } from '@/components/DonationStatusBadge/DonationStatusBadge';
import { DonationReviewActions } from '@/components/DonationReviewActions/DonationReviewActions';

export const DonationCard = ({ donation }: { donation: Donation }) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sun text-sm font-semibold">
        {getInitials(donation.donorName)}
      </span>
      <div className="flex-1">
        <p className="font-semibold">{donation.donorName}</p>
        <p className="text-xs text-neutral-600">
          {donation.donorEmail} · {donation.createdLabel}
        </p>
      </div>
      <DonationStatusBadge status={donation.status} />
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl bg-cream p-3">
        <p className="text-xs text-neutral-500">Alimentos para donar</p>
        <p className="font-semibold">{donation.items}</p>
      </div>
      <div className="rounded-xl bg-cream p-3">
        <p className="text-xs text-neutral-500">Primer vencimiento</p>
        <p className="font-semibold">{donation.expiresLabel}</p>
      </div>
    </div>

    {donation.status === 'pending' ? (
      <DonationReviewActions id={donation.id} />
    ) : (
      <p className="text-xs text-neutral-500">Esta oferta ya fue revisada.</p>
    )}
  </article>
);