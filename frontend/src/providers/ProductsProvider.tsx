'use client';

import { createContext, ReactNode, useContext } from 'react';
import type { Product } from '@/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

interface ProductsProviderProps {
  products: Product[];
  error: string | null;
  children: ReactNode;
}

export const ProductsProvider = ({ products, error, children }: ProductsProviderProps) => (
  <ProductsContext.Provider value={{ products, loading: false, error }}>
    {children}
  </ProductsContext.Provider>
);

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};