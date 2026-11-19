'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  label: string;
  exact?: boolean;
  variant: 'light' | 'dark';
  badge?: number;
}

const variants = {
  light: {
    active: 'bg-brand text-white shadow-glow-brand',
    idle: 'text-neutral-700 hover:bg-brand-soft',
  },
  dark: {
    active: 'bg-white/15 text-white',
    idle: 'text-white/70 hover:bg-white/10',
  },
};

export const SidebarLink = ({ href, label, exact = false, variant, badge }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const styles = variants[variant];

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        isActive ? styles.active : styles.idle
      }`}
    >
      {label}
      {badge ? (
        <span className="rounded-full bg-rose px-2 py-0.5 text-xs font-bold text-ink">{badge}</span>
      ) : null}
    </Link>
  );
};