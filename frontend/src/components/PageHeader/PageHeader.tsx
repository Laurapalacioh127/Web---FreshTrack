import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, subtitle, action }: PageHeaderProps) => (
  <header className="flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && (
        <span className="inline-block rounded-full bg-sun px-3 py-1 text-[11px] font-bold tracking-widest">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
    </div>
    {action}
  </header>
);