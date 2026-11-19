'use client';

import Link from 'next/link';
import { useInventory } from '@/providers/InventoryProvider';
import { useUsers } from '@/providers/UsersProvider';
import { StatCard } from '@/components/StatCard/StatCard';
import { ExpiringItemCard } from '@/components/ExpiringItemCard/ExpiringItemCard';
import { ImpactBanner } from '@/components/ImpactBanner/ImpactBanner';

const UserHomePage = () => {
  const { items, summary, loading, error } = useInventory();
  const { household } = useUsers();

  if (loading) return <p>Cargando tu inventario…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const expiringSoon = items
    .filter((item) => item.status === 'soon')
    .sort((a, b) => a.expiresInDays - b.expiresInDays)
    .slice(0, 3);

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <h1 className="text-4xl font-light">Hola, {household?.name.split(' ')[0]} 👋</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Registrados" value={summary?.registered ?? 0} tone="blue" emoji="📦" />
<StatCard label="Por vencer" value={summary?.expiringSoon ?? 0} hint="Próximos 3 días" tone="yellow" emoji="⏰" />
<StatCard label="Vencidos" value={summary?.expired ?? 0} hint="Revísalos hoy" tone="rose" emoji="🥀" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-brand">ACTÚA A TIEMPO</p>
            <h2 className="text-2xl font-light">Vence pronto</h2>
          </div>
          <Link href="/user/inventory" className="text-sm font-semibold text-brand">
            Ver inventario →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {expiringSoon.map((item) => (
            <ExpiringItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <Link
        href="/user/shopping-list"
        className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
      >
        <div>
          <span className="rounded-full bg-sun px-2 py-0.5 text-xs font-semibold">Generado para ti</span>
          <p className="mt-2 font-medium">Lista de Mercado Inteligente</p>
          <p className="text-sm text-neutral-600">Compra solo lo necesario según tu inventario y tus hábitos.</p>
        </div>
        <span className="text-sm font-semibold text-brand">Ver mi lista →</span>
      </Link>

      {household && <ImpactBanner kgSaved={household.kgSaved} points={household.points} />}
    </div>
  );
};

export default UserHomePage;