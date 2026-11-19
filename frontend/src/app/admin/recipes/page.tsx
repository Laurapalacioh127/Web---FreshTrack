'use client';

import { useState } from 'react';
import { useRecipes } from '@/providers/RecipesProvider';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { RecipeQueueItem } from '@/components/RecipeQueueItem/RecipeQueueItem';
import { RecipeReviewPanel } from '@/components/RecipeReviewPanel/RecipeReviewPanel';

type Decision = 'approved' | 'rejected';

const AdminRecipesPage = () => {
  const { recipes, loading, error } = useRecipes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  if (loading) return <p>Cargando recetas…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const queue = recipes.filter((recipe) => recipe.status === 'pending' && !decisions[recipe.id]);
  const selected = queue.find((recipe) => recipe.id === selectedId) ?? queue[0];

  const decide = (id: string, decision: Decision) =>
    setDecisions((prev) => ({ ...prev, [id]: decision }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CALIDAD DE LA COMUNIDAD"
        title="Moderación de recetas"
        subtitle={`${queue.length} recetas esperan revisión nutricional y editorial.`}
      />
      {!selected ? (
        <p className="rounded-2xl bg-brand-soft p-6 text-sm">
          No hay recetas pendientes de revisión. ¡Buen trabajo!
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-3">
            <p className="px-2 text-sm font-semibold">Pendientes {queue.length}</p>
            {queue.map((recipe) => (
              <RecipeQueueItem
                key={recipe.id}
                recipe={recipe}
                selected={recipe.id === selected.id}
                onSelect={() => setSelectedId(recipe.id)}
              />
            ))}
          </aside>
          <RecipeReviewPanel
            key={selected.id}
            recipe={selected}
            onApprove={() => decide(selected.id, 'approved')}
            onReject={() => decide(selected.id, 'rejected')}
          />
        </div>
      )}
    </div>
  );
};

export default AdminRecipesPage;