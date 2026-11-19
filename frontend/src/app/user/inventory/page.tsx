'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useInventory } from '@/providers/InventoryProvider';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { CategoryChips } from '@/components/CategoryChips/CategoryChips';
import { InventoryRow } from '@/components/InventoryRow/InventoryRow';

const ALL = 'Todos';

const InventoryPage = () => {
  const { items, loading, error } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);

  if (loading) return <p>Cargando inventario…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const categoryNames = Array.from(new Set(items.map((item) => item.category)));
  const chips = [
    { name: ALL, count: items.length },
    ...categoryNames.map((name) => ({
      name,
      count: items.filter((item) => item.category === name).length,
    })),
  ];

  const visible = items.filter(
    (item) =>
      (category === ALL || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );
  const groups = Array.from(new Set(visible.map((item) => item.category)));

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow="TU COCINA, AL DÍA"
        title="Mi inventario"
        subtitle={`${items.length} alimentos registrados · actualizado ahora`}
        action={
          <Link
            href="/user/scan"
            className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Agregar alimento
          </Link>
        }
      />
      <SearchBox placeholder="Buscar en mi inventario" value={search} onChange={setSearch} />
      <CategoryChips categories={chips} selected={category} onSelect={setCategory} />
      {groups.length === 0 && (
        <p className="text-sm text-neutral-600">No hay alimentos que coincidan con tu búsqueda.</p>
      )}
      {groups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{group}</h2>
          {visible
            .filter((item) => item.category === group)
            .map((item) => (
              <InventoryRow key={item.id} item={item} />
            ))}
        </section>
      ))}
    </div>
  );
};

export default InventoryPage;