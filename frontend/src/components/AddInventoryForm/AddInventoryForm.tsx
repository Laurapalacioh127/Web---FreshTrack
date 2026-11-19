'use client';

import { useActionState, useState } from 'react';
import { createInventoryItem } from '@/lib/inventory-actions';

export type CatalogProduct = {
  id: number;
  productName: string;
  category: string;
  avgShelfLifeDays: number;
};

const inputClass =
  'rounded-2xl border-2 border-transparent bg-cream px-4 py-3 text-sm font-normal outline-none transition focus:border-brand focus:bg-white';

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

export const AddInventoryForm = ({ products }: { products: CatalogProduct[] }) => {
  const [state, formAction, pending] = useActionState(createInventoryItem, null);
  const [expiration, setExpiration] = useState('');
  const categories = Array.from(new Set(products.map((product) => product.category)));

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find((candidate) => String(candidate.id) === event.target.value);
    if (product) setExpiration(addDays(product.avgShelfLifeDays));
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Producto
        <select
          name="masterProductId"
          required
          defaultValue=""
          onChange={handleProductChange}
          className={inputClass}
        >
          <option value="" disabled>Elige un producto del catálogo</option>
          {categories.map((category) => (
            <optgroup key={category} label={category}>
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold">
        Cantidad (unidades)
        <input name="quantity" type="number" min={1} max={1000} defaultValue={1} required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold">
        Fecha de vencimiento
        <input
          name="expirationDate"
          type="date"
          required
          value={expiration}
          onChange={(event) => setExpiration(event.target.value)}
          className={inputClass}
        />
        <span className="text-xs font-normal text-neutral-500">
          Se sugiere según la vida útil promedio del producto. Puedes cambiarla.
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow-brand transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? 'Guardando…' : 'Guardar en inventario ✓'}
      </button>
    </form>
  );
};