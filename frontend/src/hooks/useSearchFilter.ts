'use client';

import { useState } from 'react';

interface SearchFilterOptions<T> {
  getText: (item: T) => string;
  getCategory: (item: T) => string;
  allLabel: string;
}

// Búsqueda por texto + filtro por categoría, reutilizable en cualquier lista.
export function useSearchFilter<T>(
  items: T[],
  { getText, getCategory, allLabel }: SearchFilterOptions<T>
) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(allLabel);

  const categoryNames = Array.from(new Set(items.map(getCategory)));
  const chips = [
    { name: allLabel, count: items.length },
    ...categoryNames.map((name) => ({
      name,
      count: items.filter((item) => getCategory(item) === name).length,
    })),
  ];

  const visible = items.filter(
    (item) =>
      (category === allLabel || getCategory(item) === category) &&
      getText(item).toLowerCase().includes(search.toLowerCase())
  );

  return { search, setSearch, category, setCategory, chips, visible };
}