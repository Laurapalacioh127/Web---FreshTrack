'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import type { InventoryItem, InventorySummary, ShoppingItem } from '@/types';

interface InventoryContextType {
  items: InventoryItem[];
  summary: InventorySummary | null;
  shoppingList: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

interface InventoryProviderProps {
  items: InventoryItem[];
  error: string | null;
  children: ReactNode;
}

export const InventoryProvider = ({ items, error, children }: InventoryProviderProps) => {
  const value = useMemo<InventoryContextType>(
    () => ({
      items,
      summary: {
        registered: items.length,
        expiringSoon: items.filter((item) => item.status === 'soon').length,
        expired: items.filter((item) => item.status === 'expired').length,
      },
      shoppingList: [],
      loading: false,
      error,
    }),
    [items, error]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};