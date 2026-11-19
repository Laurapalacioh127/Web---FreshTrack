'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useInventory } from '@/providers/InventoryProvider';
import { createDonation } from '@/lib/donation-actions';
import { Thumb } from '@/components/Thumb/Thumb';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge';

const DonatePage = () => {
  const { items, error } = useInventory();
  const [state, formAction, pending] = useActionState(createDonation, null);

  if (error) return <p className="text-red-600">{error}</p>;

  const donable = items
    .filter((item) => item.status !== 'expired' && item.units > 0)
    .sort((a, b) => a.expiresInDays - b.expiresInDays);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-light">Donar alimentos</h1>
      <p className="text-sm text-neutral-600">
        Marca lo que quieres ofrecer y cuántas unidades. Un administrador revisará tu oferta antes de aceptarla.
      </p>

      {donable.length === 0 ? (
        <p className="rounded-2xl bg-brand-soft p-4 text-sm">
          No tienes alimentos disponibles para donar. Agrega alimentos a tu inventario primero.
        </p>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-sun/40 p-4">
          {donable.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <input type="checkbox" name="inventoryId" value={item.id} aria-label={`Donar ${item.name}`} />
              <Thumb name={item.name} category={item.category} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-neutral-600">Disponible: {item.quantity}</p>
              </div>
              <input
                type="number"
                name={`quantity-${item.id}`}
                min={1}
                max={item.units}
                defaultValue={item.units}
                aria-label={`Unidades de ${item.name}`}
                className="w-16 rounded-lg border border-black/10 px-2 py-1 text-sm"
              />
              <StatusBadge status={item.status} expiresInDays={item.expiresInDays} />
            </div>
          ))}
        </div>
      )}

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || donable.length === 0}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow-brand transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? 'Enviando…' : 'Enviar oferta ♡'}
        </button>
        <Link href="/user/inventory" className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold">
          Cancelar
        </Link>
      </div>
    </form>
  );
};

export default DonatePage;