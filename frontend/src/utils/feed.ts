//Arma las entradas del “Feed en vivo” a partir de lo que ya traen los providers.
import type { Donation, Recipe } from '@/types';

export interface FeedEntry {
  id: string;
  title: string;
  detail: string;
  tag: string;
  actionLabel: string;
  href: string;
}

export const buildFeed = (donations: Donation[], recipes: Recipe[]): FeedEntry[] => {
  const pendingDonations = donations
    .filter((donation) => donation.status === 'pending')
    .map((donation) => ({
      id: `donation-${donation.id}`,
      title: 'Nueva oferta de donación',
      detail: `${donation.items} · ${donation.zone}`,
      tag: 'Urgencia alta',
      actionLabel: 'Revisar oferta',
      href: '/admin/donations',
    }));

  const pendingRecipes = recipes
    .filter((recipe) => recipe.status === 'pending')
    .map((recipe) => ({
      id: `recipe-${recipe.id}`,
      title: 'Nueva receta para revisión',
      detail: `"${recipe.title}" · por ${recipe.author}`,
      tag: 'Nueva',
      actionLabel: 'Revisar receta',
      href: '/admin/recipes',
    }));

  const assignedDonations = donations
    .filter((donation) => donation.status === 'approved')
    .map((donation) => ({
      id: `assigned-${donation.id}`,
      title: 'Donación asignada',
      detail: `${donation.donorName} · ${donation.zone}`,
      tag: 'Asignada',
      actionLabel: 'Ver seguimiento',
      href: '/admin/donations',
    }));

  return [...pendingDonations, ...pendingRecipes, ...assignedDonations].slice(0, 5);
};