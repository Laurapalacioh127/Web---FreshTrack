'use client';

import { useState } from 'react';
import { useInventory } from '@/providers/InventoryProvider';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { ShoppingRow } from '@/components/ShoppingRow/ShoppingRow';

const ShoppingListPage = () => {
  const { shoppingList, items, loading, error } = useInventory();
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  if (loading) return <p>Cargando tu lista…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const isChecked = (id: string, initial: boolean) => overrides[id] ?? initial;
  const toggle = (id: string, initial: boolean) =>
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? initial) }));
  const pending = shoppingList.filter((item) => !isChecked(item.id, item.checked)).length;

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow="COMPRA MEJOR, DESPERDICIA MENOS"
        title="Lista de Mercado Inteligente"
        subtitle="Sugerencias basadas en tu historial, patrones de consumo y existencias actuales."
      />
      <div className="rounded-2xl bg-sun p-4 text-sm">
        <p className="font-semibold">Análisis actualizado</p>
        <p>Revisamos {items.length} productos y tus últimas compras.</p>
      </div>
      <p className="text-sm font-semibold">Compra sugerida · {pending} productos pendientes</p>
      <div className="flex flex-col gap-3">
        {shoppingList.map((item) => (
          <ShoppingRow
            key={item.id}
            item={item}
            checked={isChecked(item.id, item.checked)}
            onToggle={() => toggle(item.id, item.checked)}
          />
        ))}
      </div>
      <div className="rounded-2xl bg-brand-soft p-4 text-sm">
        <p className="font-semibold">¿Por qué sugerimos estos productos?</p>
        <p>
          FreshTrack prioriza lo que se está agotando y aprende de lo que consumes con frecuencia,
          sin recomendar productos que aún tienes disponibles.
        </p>
      </div>
    </div>
  );
};

export default ShoppingListPage;