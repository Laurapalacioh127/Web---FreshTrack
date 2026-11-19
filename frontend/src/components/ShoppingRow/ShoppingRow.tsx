'use client';

import type { ShoppingItem } from '@/types';
import { Thumb } from '@/components/Thumb/Thumb';

interface ShoppingRowProps {
  item: ShoppingItem;
  checked: boolean;
  onToggle: () => void;
}

export const ShoppingRow = ({ item, checked, onToggle }: ShoppingRowProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onToggle()}
      className="h-5 w-5 accent-brand"
    />
    <Thumb name={item.name} />
    <div className="flex-1">
      <p className={`font-semibold ${checked ? 'text-neutral-400 line-through' : ''}`}>{item.name}</p>
      <p className="text-sm text-neutral-600">{item.quantity}</p>
    </div>
    <span className="rounded-full bg-sun px-3 py-1 text-xs font-semibold">{item.reason}</span>
  </div>
);