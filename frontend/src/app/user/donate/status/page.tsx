import Link from 'next/link';
import { DonationTimeline } from '@/components/DonationTimeline/DonationTimeline';

const steps = [
  { title: 'Pendiente', detail: 'Hoy, 10:24', done: true },
  { title: 'Asignada', detail: 'Fundación Semillas', done: true },
  { title: 'Completada', detail: 'Después de la entrega', done: false },
];

const DonationStatusPage = () => (
  <div className="flex max-w-xl flex-col gap-5">
    <div className="rounded-2xl bg-ink p-4 text-white">
      <p className="text-sm font-semibold">¡Donación asignada!</p>
      <p className="text-xs text-white/70">Fundación Semillas recogerá tus productos mañana.</p>
    </div>

    <span className="w-fit rounded-full bg-ops-soft px-3 py-1 text-xs font-semibold text-ops">
      Donación #FT-1084
    </span>
    <h1 className="text-4xl font-light">Tu donación está en camino</h1>
    <p className="text-sm text-neutral-600">
      Gracias por darle una segunda oportunidad a tus alimentos.
    </p>

    <div className="flex h-40 items-center justify-center rounded-3xl bg-brand">
      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">Zero waste</span>
    </div>

    <DonationTimeline steps={steps} />

    <div className="rounded-xl border border-black/5 bg-white p-4 text-sm">
      <p className="text-xs text-neutral-500">Ventana de recogida</p>
      <p className="font-semibold">Mañana, 9:00 - 11:00</p>
    </div>
    <div className="rounded-xl bg-sun p-4 text-sm">
      <p className="font-semibold">+120 puntos ganados</p>
      <p className="text-xs">Tu impacto sigue creciendo.</p>
    </div>

    <Link href="/user" className="w-fit rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-6 py-3 text-sm font-semibold text-white">
      Volver al inicio
    </Link>
  </div>
);

export default DonationStatusPage;