'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosProvider';
import type { Recipe } from '@/types';

interface RecipesContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const RecipesContext = createContext<RecipesContextType | null>(null);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const axios = useAxios();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const res = await axios.get<Recipe[]>('/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    onInit();
  }, [axios]);

  return (
    <RecipesContext.Provider value={{ recipes, loading, error }}>
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
};