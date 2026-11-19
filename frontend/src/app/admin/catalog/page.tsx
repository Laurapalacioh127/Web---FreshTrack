'use client';

import { useState } from 'react';
import { useProducts } from '@/providers/ProductsProvider';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { CategoryChips } from '@/components/CategoryChips/CategoryChips';
import { ProductRow } from '@/components/ProductRow/ProductRow';
import { NewProductModal } from '@/components/NewProductModal/NewProductModal';

const ALL = 'Todas';

const AdminCatalogPage = () => {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <p>Cargando catálogo…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const categoryNames = Array.from(new Set(products.map((product) => product.category)));
  const chips = [
    { name: ALL, count: products.length },
    ...categoryNames.map((name) => ({
      name,
      count: products.filter((product) => product.category === name).length,
    })),
  ];

  const visible = products.filter(
    (product) =>
      (category === ALL || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="DATOS MAESTROS"
        title="Catálogo maestro"
        subtitle="Gestiona productos, vida útil y sustitutos inteligentes."
        action={
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold"
            >
              Editar reglas de vencimiento
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white"
            >
              + Nuevo producto maestro
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-64">
          <SearchBox placeholder="Buscar producto" value={search} onChange={setSearch} />
        </div>
        <CategoryChips categories={chips} selected={category} onSelect={setCategory} />
      </div>

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

      {modalOpen && <NewProductModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default AdminCatalogPage;