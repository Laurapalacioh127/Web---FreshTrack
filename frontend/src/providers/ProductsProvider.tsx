'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosProvider';
import type { Product } from '@/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const axios = useAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const res = await axios.get<Product[]>('/api/products');
        setProducts(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    onInit();
  }, [axios]);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};