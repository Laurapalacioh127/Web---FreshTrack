'use client';

import { useState } from 'react';
import { useProducts } from '@/providers/ProductsProvider';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { CategoryChips } from '@/components/CategoryChips/CategoryChips';
import { ProductRow } from '@/components/ProductRow/ProductRow';
import { NewProductModal } from '@/components/NewProductModal/NewProductModal';
import { PendingIntegrationNotice } from '@/components/PendingIntegrationNotice/PendingIntegrationNotice';

const AdminCatalogPage = () => {
  const { products, error } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const { search, setSearch, category, setCategory, chips, visible } = useSearchFilter(products, {
    getText: (product) => product.name,
    getCategory: (product) => product.category,
    allLabel: 'Todas',
  });

  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="DATOS MAESTROS"
        title="Catálogo maestro"
        subtitle="Productos base que usan el inventario y las recetas."
      />
      <PendingIntegrationNotice message="La lista viene del backend (GET /api/catalog). Crear y editar productos todavía no está conectado: es parte del plan para la entrega final." />

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-64">
          <SearchBox placeholder="Buscar producto" value={search} onChange={setSearch} />
        </div>
        <CategoryChips categories={chips} selected={category} onSelect={setCategory} />
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-neutral-600">No hay productos que coincidan.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="pb-3">PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>VIDA ÚTIL PROMEDIO</th>
                <th>SUSTITUTOS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <NewProductModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default AdminCatalogPage;