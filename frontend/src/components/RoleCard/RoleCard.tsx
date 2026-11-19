import Link from 'next/link';
import type { Portal } from '@/types';
import { portalTheme } from '@/utils/portalTheme';
import { Photo } from '@/components/Photo/Photo';

interface RoleCardProps {
  portal: Portal;
  tag: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  photo: string;
}

export const RoleCard = ({ portal, tag, title, description, href, buttonLabel, photo }: RoleCardProps) => {
  const theme = portalTheme[portal];

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[2rem] text-left shadow-soft transition hover:-translate-y-1 hover:shadow-pop ${theme.card}`}
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden text-8xl">
        <span>{theme.emoji}</span>
        <Photo
          src={photo}
          sizes="(min-width: 768px) 500px, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-3 p-8">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold shadow-soft">{tag}</span>
        <h3 className="text-3xl leading-tight">{title}</h3>
        <p className="text-sm text-neutral-700">{description}</p>
        <Link href={href} className={`mt-2 rounded-full px-6 py-3 text-sm font-bold ${theme.button}`}>
          {buttonLabel} →
        </Link>
      </div>
    </article>
  );
};