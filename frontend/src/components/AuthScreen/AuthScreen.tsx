import Link from 'next/link';
import type { Portal } from '@/types';
import { portalTheme } from '@/utils/portalTheme';
import { Logo } from '@/components/logo/Logo';
import { Photo } from '@/components/Photo/Photo';
import { AuthForm } from '@/components/AuthForm/AuthForm';

const copy: Record<Portal, { badge: string; title: string; photo: string }> = {
  user: { badge: 'Cuenta personal', title: 'Ingresa a tu cuenta', photo: '/photos/login-user.jpg' },
  admin: { badge: 'Portal de operaciones', title: 'Acceso al equipo FreshTrack', photo: '/photos/login-admin.jpg' },
};

export const AuthScreen = ({ portal }: { portal: Portal }) => {
  const theme = portalTheme[portal];

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <section className="flex flex-col justify-center gap-6 px-6 py-10 md:px-16">
        <Logo />
        <div className="flex items-center gap-3 text-xs">
          <Link href="/" className="font-bold">← Cambiar de rol</Link>
          <span className={`rounded-full px-3 py-1 font-bold ${theme.badge}`}>{copy[portal].badge}</span>
        </div>
        <div className="max-w-md rounded-[2rem] bg-white p-8 shadow-pop">
          <h1 className="mb-6 text-4xl leading-tight">{copy[portal].title}</h1>
          <AuthForm portal={portal} />
        </div>
      </section>

      <aside className={`relative hidden overflow-hidden md:block ${theme.card}`}>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem]">{theme.emoji}</span>
        <Photo src={copy[portal].photo} sizes="50vw" priority />
        <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-white/90 p-6 shadow-pop backdrop-blur">
          <p className="text-lg font-bold">“Cada alimento aprovechado es una pequeña victoria.”</p>
          <p className="mt-1 text-xs text-neutral-600">Comunidad FreshTrack</p>
        </div>
      </aside>
    </div>
  );
};