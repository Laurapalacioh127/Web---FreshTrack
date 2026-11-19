type Tone = 'blue' | 'yellow' | 'rose';

const tones: Record<Tone, string> = {
  blue: 'bg-ops text-white',
  yellow: 'bg-sun text-ink',
  rose: 'bg-rose text-ink',
};

interface StepCardProps {
  emoji: string;
  label: string;
  title: string;
  description: string;
  tone: Tone;
}

export const StepCard = ({ emoji, label, title, description, tone }: StepCardProps) => (
  <article
    className={`rounded-[2rem] p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-pop ${tones[tone]}`}
  >
    <span className="text-5xl">{emoji}</span>
    <p className="mt-4 text-xs font-black tracking-widest">{label}</p>
    <h3 className="mt-1 text-2xl leading-tight">{title}</h3>
    <p className="mt-2 text-sm opacity-90">{description}</p>
  </article>
);