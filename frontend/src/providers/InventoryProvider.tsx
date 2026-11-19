'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosProvider';
import type { InventoryItem, InventorySummary, ShoppingItem } from '@/types';

interface InventoryContextType {
  items: InventoryItem[];
  summary: InventorySummary | null;
  shoppingList: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const axios = useAxios();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const [itemsRes, summaryRes, shoppingRes] = await Promise.all([
          axios.get<InventoryItem[]>('/api/inventory'),
          axios.get<InventorySummary>('/api/inventory/summary'),
          axios.get<ShoppingItem[]>('/api/inventory/shopping-list'),
        ]);
        setItems(itemsRes.data);
        setSummary(summaryRes.data);
        setShoppingList(shoppingRes.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    onInit();
  }, [axios]);

  return (
    <InventoryContext.Provider value={{ items, summary, shoppingList, loading, error }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};