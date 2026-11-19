type Tone = 'blue' | 'yellow' | 'rose';

const tones: Record<Tone, string> = {
  blue: 'bg-ops-soft',
  yellow: 'bg-sun',
  rose: 'bg-rose-soft',
};

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  tone: Tone;
  emoji?: string;
}

export const StatCard = ({ label, value, hint, tone, emoji }: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-[1.75rem] p-5 shadow-soft transition hover:-translate-y-1 hover:rotate-1 hover:shadow-pop ${tones[tone]}`}
  >
    {emoji && <span className="absolute right-4 top-4 text-3xl">{emoji}</span>}
    <p className="text-sm font-semibold">{label}</p>
    <p className="mt-2 text-6xl font-extrabold tracking-tight">{value}</p>
    {hint && <p className="mt-1 text-xs text-neutral-700">{hint}</p>}
  </div>
);