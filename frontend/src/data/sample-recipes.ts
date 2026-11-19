import type { Recipe } from '@/types';

export const sampleRecipes: Recipe[] = [
  {
    id: '1', title: 'Ensalada de tomate y fresa', author: 'FreshTrack', minutes: 20,
    difficulty: 'Fácil', servings: 2, ingredientsAvailable: 6, ingredientsTotal: 6, status: 'approved',
    ingredients: ['Tomates cherry', 'Fresas', 'Espinaca', 'Aceite de oliva', 'Limón', 'Sal'],
    steps: ['Lava y corta los ingredientes', 'Mézclalos en un bowl', 'Aliña y sirve'],
  },
  {
    id: '2', title: 'Bowl de vegetales crujientes', author: 'FreshTrack', minutes: 25,
    difficulty: 'Fácil', servings: 3, ingredientsAvailable: 6, ingredientsTotal: 6, status: 'approved',
    ingredients: ['Espinaca', 'Tomates cherry', 'Garbanzos', 'Arroz', 'Limón', 'Sal'],
    steps: ['Cocina el arroz', 'Saltea los vegetales', 'Arma el bowl y sirve'],
  },
  {
    id: '3', title: 'Tostadas mediterráneas', author: 'FreshTrack', minutes: 15,
    difficulty: 'Fácil', servings: 2, ingredientsAvailable: 5, ingredientsTotal: 6, status: 'approved',
    ingredients: ['Pan', 'Tomates cherry', 'Yogur griego', 'Espinaca', 'Aceite de oliva', 'Albahaca'],
    steps: ['Tuesta el pan', 'Unta el yogur', 'Agrega los vegetales y sirve'],
  },
  {
    id: '4', title: 'Arepas rellenas de vegetales', author: 'Laura Martínez', minutes: 20,
    difficulty: 'Fácil', servings: 2, ingredientsAvailable: 4, ingredientsTotal: 4, status: 'pending',
    ingredients: ['2 arepas de maíz', '1 tomate maduro', '½ aguacate', '100 g de espinaca'],
    steps: ['Calienta las arepas a fuego medio', 'Saltea los vegetales durante 5 minutos', 'Rellena y sirve con aguacate'],
  },
  {
    id: '5', title: 'Bowl de aprovechamiento', author: 'María P.', minutes: 15,
    difficulty: 'Media', servings: 2, ingredientsAvailable: 5, ingredientsTotal: 5, status: 'pending',
    ingredients: ['Arroz', 'Garbanzos', 'Espinaca', 'Tomates cherry', 'Limón'],
    steps: ['Calienta el arroz', 'Mezcla con los demás ingredientes', 'Sirve'],
  },
  {
    id: '6', title: 'Sopa rápida de tomate', author: 'María P.', minutes: 30,
    difficulty: 'Media', servings: 4, ingredientsAvailable: 4, ingredientsTotal: 4, status: 'pending',
    ingredients: ['Tomates', 'Cebolla', 'Ajo', 'Caldo de verduras'],
    steps: ['Sofríe la cebolla y el ajo', 'Agrega los tomates y el caldo', 'Licúa y sirve'],
  },
];