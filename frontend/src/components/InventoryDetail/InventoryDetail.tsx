//lee el id de la URL y busca el alimento en lo que ya cargó el provider
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { InventoryStatus } from '@/types';
import { useInventory } from '@/providers/InventoryProvider';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';
import { DetailField } from '@/components/DetailField/DetailField';
import { formatExpiry } from '@/utils/format';

const statusLabels: Record<InventoryStatus, string> = {
  ok: 'Fresco',
  soon: 'Por vencer',
  expired: 'Vencido',
};

export const InventoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { items, loading, error } = useInventory();

  if (loading) return <p>Cargando alimento…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    return (
      <div className="flex flex-col gap-3">
        <p>No encontramos este alimento.</p>
        <Link href="/user/inventory" className="text-sm font-semibold text-brand">
          ← Mi inventario
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Link href="/user/inventory" className="text-sm font-semibold">
        ← Mi inventario
      </Link>
      <StatusBadge status={item.status} expiresInDays={item.expiresInDays} />
      <h1 className="text-5xl font-light">{item.name}</h1>
      <div className="grid grid-cols-2 gap-3">
        <DetailField label="Categoría" value={item.category} />
        <DetailField label="Cantidad" value={item.quantity} />
        <DetailField label="Vencimiento" value={formatExpiry(item.expiresInDays)} />
        <DetailField label="Estado" value={statusLabels[item.status]} />
      </div>
      <Link href="/user/recipes" className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 py-3 text-center text-sm font-semibold text-white">
        Buscar receta
      </Link>
      <Link href="/user/donate" className="rounded-full bg-ops shadow-glow-ops transition hover:-translate-y-0.5 py-3 text-center text-sm font-semibold text-white">
        Donar alimento
      </Link>
    </div>
  );
};