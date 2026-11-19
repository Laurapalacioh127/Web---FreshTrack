'use client';

import Link from 'next/link';
import { useInventory } from '@/providers/InventoryProvider';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { CategoryChips } from '@/components/CategoryChips/CategoryChips';
import { InventoryRow } from '@/components/InventoryRow/InventoryRow';

const InventoryPage = () => {
  const { items, error } = useInventory();
  const { search, setSearch, category, setCategory, chips, visible } = useSearchFilter(items, {
    getText: (item) => item.name,
    getCategory: (item) => item.category,
    allLabel: 'Todos',
  });

  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  const groups = Array.from(new Set(visible.map((item) => item.category)));

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow="TU COCINA, AL DÍA"
        title="Mi inventario"
        subtitle={`${items.length} alimentos registrados`}
        action={
          <Link
            href="/user/scan"
            className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Agregar alimento
          </Link>
        }
      />
      {items.length === 0 ? (
        <p className="rounded-2xl bg-brand-soft p-6 text-sm">
          Todavía no tienes alimentos registrados. Agrega el primero para empezar a cuidar tu inventario.
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default InventoryPage;