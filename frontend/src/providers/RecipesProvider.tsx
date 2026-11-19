'use client';

import { createContext, ReactNode, useContext } from 'react';
import { sampleRecipes } from '@/data/sample-recipes';
import type { Recipe } from '@/types';

interface RecipesContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const RecipesContext = createContext<RecipesContextType | null>(null);

// Datos de ejemplo: la integración con /api/recipes está pendiente (ver README).
export const RecipesProvider = ({ children }: { children: ReactNode }) => (
  <RecipesContext.Provider value={{ recipes: sampleRecipes, loading: false, error: null }}>
    {children}
  </RecipesContext.Provider>
);

export const useRecipes = () => {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
};