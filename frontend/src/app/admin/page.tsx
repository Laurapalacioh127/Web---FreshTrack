'use client';

import { useDonations } from '@/providers/DonationsProvider';
import { useProducts } from '@/providers/ProductsProvider';
import { useRecipes } from '@/providers/RecipesProvider';
import { useUsers } from '@/providers/UsersProvider';
import { StatCard } from '@/components/StatCard/StatCard';
import { FeedItem } from '@/components/FeedItem/FeedItem';
import { ImpactSummary } from '@/components/ImpactSummary/ImpactSummary';
import { buildFeed } from '@/utils/feed';

const AdminHomePage = () => {
  const { admin } = useUsers();
  const { donations, summary, loading: donationsLoading, error } = useDonations();
  const { recipes, loading: recipesLoading } = useRecipes();
  const { products } = useProducts();

  if (donationsLoading || recipesLoading) return <p>Cargando centro de operaciones…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const feed = buildFeed(donations, recipes);
  const pendingRecipes = recipes.filter((recipe) => recipe.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand">CENTRO DE OPERACIONES</p>
          <h1 className="text-4xl font-light">Buenos días, {admin?.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-neutral-600">Esto es lo que está pasando en FreshTrack hoy.</p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
          ● En vivo
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Donaciones pendientes" value={summary?.pendingDonations ?? 0} tone="yellow" emoji="🎁" />
<StatCard label="Recetas por revisar" value={pendingRecipes} tone="blue" emoji="📖" />
<StatCard label="Productos en catálogo" value={products.length} tone="rose" emoji="🥕" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-brand">ACTIVIDAD RECIENTE</p>
            <h2 className="text-2xl font-light">Feed en tiempo real</h2>
          </div>
          {feed.map((entry, index) => (
            <FeedItem key={entry.id} entry={entry} highlight={index === 0} />
          ))}
        </section>
        {summary && <ImpactSummary summary={summary} />}
      </div>
    </div>
  );
};

export default AdminHomePage;