import Link from 'next/link';
import { Photo } from '@/components/Photo/Photo';
import { formatKg } from '@/utils/format';

interface ImpactBannerProps {
  kgSaved: number;
  points: number;
}

export const ImpactBanner = ({ kgSaved, points }: ImpactBannerProps) => (
  <section className="relative overflow-hidden rounded-[2rem] bg-brand text-white shadow-pop">
    <Photo src="/photos/impact.jpg" sizes="(min-width: 1024px) 900px, 100vw" className="opacity-25" />
    <div className="relative flex items-center justify-between gap-6 p-8">
      <div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">Tu impacto 🌱</span>
        <h2 className="mt-4 text-3xl">
          Has evitado <span className="text-sun">{formatKg(kgSaved)} kg</span> de desperdicio
        </h2>
        <p className="mt-1 text-sm text-white/80">
          Eso equivale a unos {Math.round(kgSaved / 0.4)} platos de comida aprovechados.
        </p>
        <Link
          href="/user/recipes"
          className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold shadow-pop transition hover:-translate-y-0.5"
        >
          Buscar receta
        </Link>
      </div>
      <div className="flex h-32 w-32 shrink-0 rotate-6 flex-col items-center justify-center rounded-full bg-sun text-ink shadow-pop">
        <span className="text-4xl font-extrabold">{points}</span>
        <span className="text-xs font-bold">puntos</span>
      </div>
    </div>
  </section>
);