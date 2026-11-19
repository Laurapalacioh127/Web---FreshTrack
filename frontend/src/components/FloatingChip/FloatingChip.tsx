type Tone = 'blue' | 'yellow' | 'rose';

const tones: Record<Tone, string> = {
  blue: 'bg-ops text-white',
  yellow: 'bg-sun text-ink',
  rose: 'bg-rose text-ink',
};

interface FloatingChipProps {
  tone: Tone;
  title: string;
  subtitle: string;
  className?: string;
}

export const FloatingChip = ({ tone, title, subtitle, className = '' }: FloatingChipProps) => (
  <div className={`absolute rounded-2xl px-4 py-3 shadow-pop ${tones[tone]} ${className}`}>
    <p className="text-[11px] font-black tracking-widest">{title}</p>
    <p className="text-xs">{subtitle}</p>
  </div>
);