'use client';

interface Category {
  name: string;
  count: number;
}

interface CategoryChipsProps {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryChips = ({ categories, selected, onSelect }: CategoryChipsProps) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((category) => (
      <button
        key={category.name}
        type="button"
        onClick={() => onSelect(category.name)}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
          selected === category.name ? 'bg-ink text-white' : 'bg-white'
        }`}
      >
        {category.name} {category.count}
      </button>
    ))}
  </div>
);