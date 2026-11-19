import { Photo } from '@/components/Photo/Photo';

interface ImpactStat {
  value: string;
  label: string;
}

export const ImpactBand = ({ stats }: { stats: ImpactStat[] }) => (
  <section className="relative overflow-hidden bg-ink text-white">
    <Photo src="/photos/impact.jpg" sizes="100vw" className="opacity-40" />
    <div className="relative mx-auto grid max-w-6xl gap-6 px-8 py-16 md:grid-cols-4 md:items-center">
      <div>
        <p className="text-3xl font-extrabold text-sun">Menos desperdicio.</p>
        <p className="text-3xl font-extrabold">Más comunidad.</p>
      </div>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <p className="text-4xl font-extrabold">{stat.value}</p>
          <p className="mt-1 text-sm text-white/70">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);