//el contador rosa sale de las recetas pendientes
'use client';

import Link from 'next/link';
import { useRecipes } from '@/providers/RecipesProvider';
import { Logo } from '@/components/logo/Logo';
import { SidebarLink } from '@/components/SidebarLink/SidebarLink';

export const AdminSidebar = () => {
  const { recipes } = useRecipes();
  const pendingRecipes = recipes.filter((recipe) => recipe.status === 'pending').length;

  const links = [
    { href: '/admin', label: 'Feed en vivo', exact: true },
    { href: '/admin/donations', label: 'Donaciones' },
    { href: '/admin/recipes', label: 'Moderación de recetas', badge: pendingRecipes },
    { href: '/admin/catalog', label: 'Catálogo maestro' },
    { href: '/admin/settings', label: 'Configuración' },
  ];

  return (
    <aside className="m-4 flex w-60 shrink-0 flex-col gap-6 rounded-[2rem] bg-ink p-5 text-white shadow-pop">
      <Logo light />
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <SidebarLink key={link.href} {...link} variant="dark" />
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-xl border border-white/10 p-3">
          <p className="text-sm font-semibold">Equipo FreshTrack</p>
          <p className="text-xs text-white/60">Operaciones · Cali</p>
        </div>
        <Link href="/" className="px-3 text-sm font-medium text-white/70">
          Cerrar sesión
        </Link>
      </div>
    </aside>
  );
};