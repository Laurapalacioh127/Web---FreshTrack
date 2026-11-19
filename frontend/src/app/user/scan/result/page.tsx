import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { AddInventoryForm, type CatalogProduct } from '@/components/AddInventoryForm/AddInventoryForm';

const AddFoodPage = async () => {
  const response = await apiFetch('/catalog');
  const raw = response?.ok ? await response.json().catch(() => null) : null;
  const products: CatalogProduct[] | null = Array.isArray(raw) ? raw : null;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link href="/user/inventory" className="text-sm font-semibold">
        ← Mi inventario
      </Link>
      <PageHeader
        eyebrow="NUEVO ALIMENTO"
        title="Agregar alimento"
        subtitle="Elige el producto del catálogo, la cantidad y cuándo vence."
      />

      {products === null && (
        <p role="alert" className="text-sm text-red-600">
          No se pudo cargar el catálogo. Intenta de nuevo en un momento.
        </p>
      )}
      {products?.length === 0 && (
        <p className="text-sm text-neutral-600">El catálogo está vacío todavía.</p>
      )}
      {products && products.length > 0 && <AddInventoryForm products={products} />}
    </div>
  );
};

export default AddFoodPage;