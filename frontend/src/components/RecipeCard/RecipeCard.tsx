'use client';

import { useState } from 'react';
import type { Recipe } from '@/types';
import { Photo } from '@/components/Photo/Photo';
import { getFoodEmoji } from '@/utils/foodEmoji';

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [open, setOpen] = useState(false);
  const percent = Math.round((recipe.ingredientsAvailable / recipe.ingredientsTotal) * 100);

  return (
    <article className="group flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-pop">
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-sun text-6xl">
        <span>{getFoodEmoji(recipe.title)}</span>
        <Photo
          src={`/photos/recipes/${recipe.id}.jpg`}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 px-1 pb-1">
        <p className="text-xs font-semibold text-neutral-500">
          {recipe.minutes} min · {recipe.servings} personas · {recipe.difficulty}
        </p>
        <h3 className="text-xl leading-tight">{recipe.title}</h3>
        <div>
          <div className="h-2 rounded-full bg-black/10">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 text-xs text-neutral-600">
            {recipe.ingredientsAvailable} de {recipe.ingredientsTotal} ingredientes disponibles
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-fit rounded-full bg-cream px-4 py-2 text-sm font-bold transition hover:bg-sun"
        >
          {open ? 'Ocultar receta' : 'Ver receta'}
        </button>
        {open && (
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="font-bold">Ingredientes</p>
              <ul className="list-disc pl-5">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold">Preparación</p>
              <ol className="list-decimal pl-5">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};