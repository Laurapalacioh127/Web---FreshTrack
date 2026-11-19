import type { Product } from '@/types';
import { Thumb } from '@/components/Thumb/Thumb';

export const ProductRow = ({ product }: { product: Product }) => (
  <tr className="border-b border-black/5">
    <td className="py-3">
      <div className="flex items-center gap-3">
        <Thumb name={product.name} category={product.category} />
        <span className="font-semibold">{product.name}</span>
      </div>
    </td>
    <td>
      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
        {product.category}
      </span>
    </td>
    <td>{product.shelfLifeDays} días</td>
    <td className="text-neutral-600">{product.substitutes.join(', ')}</td>
    <td>
      <button type="button" className="rounded-md bg-ops-soft px-3 py-1 text-xs font-semibold text-ops">
        Editar
      </button>
    </td>
  </tr>
);