import type { Portal } from '@/types';

export const portalTheme: Record<Portal, {
  card: string;
  button: string;
  submit: string;
  badge: string;
  link: string;
  emoji: string;
}> = {
  user: {
    card: 'bg-brand-soft',
    button: 'bg-brand text-white shadow-glow-brand transition hover:-translate-y-0.5',
    submit: 'bg-brand shadow-glow-brand transition hover:-translate-y-0.5',
    badge: 'bg-brand-soft text-brand-dark',
    link: 'text-brand',
    emoji: '🥗',
  },
  admin: {
    card: 'bg-ops-soft',
    button: 'bg-ink text-white shadow-pop transition hover:-translate-y-0.5',
    submit: 'bg-ops shadow-glow-ops transition hover:-translate-y-0.5',
    badge: 'bg-ops-soft text-ops',
    link: 'text-ops',
    emoji: '🤝',
  },
};