const byKeyword: [string, string][] = [
  ['fresa', '🍓'],
  ['tomate', '🍅'],
  ['espinaca', '🥬'],
  ['yogur', '🥛'],
  ['leche', '🥛'],
  ['garbanzo', '🫘'],
  ['arroz', '🍚'],
  ['aguacate', '🥑'],
  ['limón', '🍋'],
  ['cebolla', '🧅'],
  ['arepa', '🫓'],
  ['sopa', '🍲'],
  ['ensalada', '🥗'],
  ['bowl', '🥗'],
  ['tostada', '🍞'],
];

const byCategory: Record<string, string> = {
  Frutas: '🍓',
  Verduras: '🥬',
  Lácteos: '🥛',
  Enlatados: '🥫',
  Despensa: '🍚',
};

export const getFoodEmoji = (name: string, category?: string): string => {
  const lower = name.toLowerCase();
  const match = byKeyword.find(([keyword]) => lower.includes(keyword));
  if (match) return match[1];
  if (category && byCategory[category]) return byCategory[category];
  return name[0] ?? '🍽️';
};