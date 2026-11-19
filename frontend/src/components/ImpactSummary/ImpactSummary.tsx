import type { DonationSummary } from '@/types';
import { Photo } from '@/components/Photo/Photo';
import { formatKg } from '@/utils/format';

export const ImpactSummary = ({ summary }: { summary: DonationSummary }) => (
  <aside className="relative overflow-hidden rounded-[2rem] bg-ops text-white shadow-pop">
    <Photo src="/photos/impact.jpg" sizes="(min-width: 1024px) 400px, 100vw" className="opacity-20" />
    <div className="relative flex flex-col gap-4 p-6">
      <p className="text-xs font-bold">Hoy · Resumen de impacto</p>
      <div>
        <p className="text-7xl font-extrabold tracking-tight">{formatKg(summary.kgRescued)}</p>
        <p className="text-sm">kg rescatados</p>
      </div>
      <div>
        <div className="flex justify-between text-xs font-semibold">
          <span>Meta diaria</span>
          <span>{summary.dailyGoalPercent}%</span>
        </div>
        <div className="mt-1 h-2.5 rounded-full bg-white/25">
          <div className="h-2.5 rounded-full bg-sun" style={{ width: `${summary.dailyGoalPercent}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
          <p className="text-3xl font-extrabold">{summary.families}</p>
          <p className="text-xs">familias</p>
        </div>
        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
          <p className="text-3xl font-extrabold">{summary.deliveries}</p>
          <p className="text-xs">entregas</p>
        </div>
      </div>
    </div>
  </aside>
);