'use client';

import { useState } from 'react';
import type { Recipe } from '@/types';
import { Photo } from '@/components/Photo/Photo';
import { TextAreaField } from '@/components/TextAreaField/TextAreaField';
import { getFoodEmoji } from '@/utils/foodEmoji';

interface RecipeReviewPanelProps {
  recipe: Recipe;
  onApprove: () => void;
  onReject: () => void;
}

export const RecipeReviewPanel = ({ recipe, onApprove, onReject }: RecipeReviewPanelProps) => {
  const [notes, setNotes] = useState('');

  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-soft">
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-sun text-7xl">
        <span>{getFoodEmoji(recipe.title)}</span>
        <Photo src={`/photos/recipes/${recipe.id}.jpg`} sizes="(min-width: 1024px) 700px, 100vw" />
      </div>

      <span className="w-fit rounded-full bg-sun px-3 py-1 text-xs font-bold">
        {recipe.minutes} minutos · {recipe.difficulty}
      </span>
      <div>
        <h2 className="text-3xl">{recipe.title}</h2>
        <p className="text-sm text-neutral-600">por {recipe.author}</p>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-brand-soft p-4 text-sm">
        <div>
          <p className="font-bold">Verificación nutricional</p>
          <p className="text-xs text-neutral-600">Ingredientes y porciones coherentes</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">Aprobada</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4">
          <p className="text-sm font-bold">Ingredientes</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-cream p-4">
          <p className="text-sm font-bold">Preparación</p>
          <ol className="mt-2 list-decimal pl-5 text-sm">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <TextAreaField
        label="Observaciones requeridas"
        placeholder="Explica los cambios que debe hacer la autora…"
        value={notes}
        onChange={setNotes}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onApprove()}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-glow-brand transition hover:-translate-y-0.5"
        >
          Aprobar receta ✓
        </button>
        <button
          type="button"
          onClick={() => onReject()}
          className="rounded-full bg-rose-soft px-5 py-2.5 text-sm font-bold text-rose-900 transition hover:bg-rose"
        >
          Rechazar con observaciones
        </button>
      </div>
    </section>
  );
};