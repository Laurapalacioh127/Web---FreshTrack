'use client';

import Link from 'next/link';
import { useState } from 'react';

const RecipeStatusPage = () => {
  const [approved, setApproved] = useState(false);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          approved ? 'bg-brand-soft text-brand-dark' : 'bg-sun'
        }`}
      >
        {approved ? 'Publicada' : 'En revisión'}
      </span>
      <h1 className="text-4xl font-light">
        {approved ? '¡Tu receta fue aprobada! 🎉' : 'Tu receta está en revisión'}
      </h1>
      <p className="max-w-sm text-sm text-neutral-600">
        {approved
          ? 'Ya puedes verla en la comunidad FreshTrack.'
          : 'Nuestro equipo verificará los ingredientes y la información nutricional.'}
      </p>
      {approved ? (
        <Link href="/user/recipes" className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-6 py-3 text-sm font-semibold text-white">
          Ver recetas
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setApproved(true)}
          className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-6 py-3 text-sm font-semibold text-white"
        >
          Simular aprobación
        </button>
      )}
    </div>
  );
};

export default RecipeStatusPage;