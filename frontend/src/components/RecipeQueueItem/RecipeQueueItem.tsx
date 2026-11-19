'use client';

import type { Recipe } from '@/types';
import { Thumb } from '@/components/Thumb/Thumb';

interface RecipeQueueItemProps {
  recipe: Recipe;
  selected: boolean;
  onSelect: () => void;
}

export const RecipeQueueItem = ({ recipe, selected, onSelect }: RecipeQueueItemProps) => (
  <button
    type="button"
    onClick={() => onSelect()}
    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${
      selected ? 'bg-ops-soft' : 'hover:bg-black/5'
    }`}
  >
    <Thumb name={recipe.title} />
    <div className="flex-1">
      <p className="text-sm font-semibold">{recipe.title}</p>
      <p className="text-xs text-neutral-600">por {recipe.author}</p>
    </div>
    <span className="rounded-full bg-rose-soft px-2 py-0.5 text-xs font-semibold">{recipe.difficulty}</span>
  </button>
);