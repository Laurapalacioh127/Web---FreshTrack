import type { Recipe } from '@/types';
import { Photo } from '@/components/Photo/Photo';
import { getFoodEmoji } from '@/utils/foodEmoji';

export const FeaturedRecipe = ({ recipe }: { recipe: Recipe }) => (
  <section className="relative flex min-h-72 items-end overflow-hidden rounded-[2rem] bg-sun shadow-pop">
    <span className="absolute right-10 top-8 text-9xl">{getFoodEmoji(recipe.title)}</span>
    <Photo src={`/photos/recipes/${recipe.id}.jpg`} sizes="(min-width: 1024px) 900px, 100vw" priority />
    <div className="relative m-5 rounded-3xl bg-white/90 p-6 shadow-soft backdrop-blur">
      <span className="rounded-full bg-rose px-3 py-1 text-xs font-bold">Rescate del día ✨</span>
      <h2 className="mt-3 max-w-md text-3xl">{recipe.title}</h2>
      <p className="mt-1 text-sm text-neutral-700">
        Una receta fresca, simple y lista en {recipe.minutes} minutos.
      </p>
    </div>
  </section>
);