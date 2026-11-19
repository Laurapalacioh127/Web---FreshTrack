import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { toDonation } from '@/lib/mappers';
import { DonationStatusBadge } from '@/components/DonationStatusBadge/DonationStatusBadge';
import { DonationTimeline } from '@/components/DonationTimeline/DonationTimeline';
import type { Donation } from '@/types';

type DonationStatusPageProps = {
  searchParams: Promise<{ created?: string }>;
};

const reviewDetail = (status: Donation['status']) =>
  status === 'pending' ? 'En espera' : status === 'accepted' ? 'Oferta aceptada' : 'Oferta rechazada';

const DonationStatusPage = async ({ searchParams }: DonationStatusPageProps) => {
  const { created } = await searchParams;

  const response = await apiFetch('/donations');
  const raw = response?.ok ? await response.json().catch(() => null) : null;
  const donations: Donation[] | null = Array.isArray(raw) ? raw.map(toDonation) : null;

  return (
    <div className="flex max-w-xl flex-col gap-5">
      {created === '1' && (
        <div role="status" className="rounded-2xl bg-ink p-4 text-white">
          <p className="text-sm font-semibold">¡Oferta enviada!</p>
          <p className="text-xs text-white/70">Un administrador la revisará pronto.</p>
        </div>
      )}

      <h1 className="text-4xl font-light">Mis donaciones</h1>

      {donations === null && (
        <p role="alert" className="text-sm text-red-600">
          No se pudieron cargar tus donaciones. Intenta de nuevo.
        </p>
      )}
      {donations?.length === 0 && (
        <p className="text-sm text-neutral-600">Todavía no has hecho ninguna oferta de donación.</p>
      )}
      {donations?.map((donation) => (
        <article key={donation.id} className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-ops-soft px-3 py-1 text-xs font-semibold text-ops">
              Donación #{donation.id}
            </span>
            <DonationStatusBadge status={donation.status} />
          </div>
          <p className="font-semibold">{donation.items}</p>
          <DonationTimeline
            steps={[
              { title: 'Oferta enviada', detail: donation.createdLabel, done: true },
              { title: 'Revisión del administrador', detail: reviewDetail(donation.status), done: donation.status !== 'pending' },
            ]}
          />
        </article>
      ))}

      <Link
        href="/user/donate"
        className="w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-glow-brand transition hover:-translate-y-0.5"
      >
        Donar más alimentos
      </Link>
    </div>
  );
};

export default DonationStatusPage;