import type { Donation, InventoryItem, User } from '@/types';

type InventoryApiItem = {
  id: number;
  quantity: number;
  expirationDate: string;
  masterProduct: { productName: string; category: string };
};

type DonationApi = {
  id: number;
  donationStatus: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  donor: { fullName: string; email: string };
  items: {
    quantity: number;
    inventory: { expirationDate: string; masterProduct: { productName: string } };
  }[];
};

type SessionApiUser = {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
};

const SOON_DAYS = 3;
const TIME_ZONE = 'America/Bogota';

function daysUntil(expirationDate: string): number {
  const [y, m, d] = expirationDate.slice(0, 10).split('-').map(Number);
  const todayText = new Date().toLocaleDateString('en-CA', { timeZone: TIME_ZONE });
  const [ty, tm, td] = todayText.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000);
}

function formatDate(dateText: string): string {
  return new Date(`${dateText.slice(0, 10)}T12:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function toInventoryItem(item: InventoryApiItem): InventoryItem {
  const days = daysUntil(item.expirationDate);
  return {
    id: String(item.id),
    name: item.masterProduct.productName,
    category: item.masterProduct.category,
    quantity: `${item.quantity} ${item.quantity === 1 ? 'unidad' : 'unidades'}`,
    units: item.quantity,
    expiresInDays: days,
    status: days < 0 ? 'expired' : days <= SOON_DAYS ? 'soon' : 'ok',
  };
}

export function toDonation(donation: DonationApi): Donation {
  const dates = donation.items.map((item) => item.inventory.expirationDate.slice(0, 10)).sort();
  return {
    id: String(donation.id),
    donorName: donation.donor.fullName,
    donorEmail: donation.donor.email,
    items: donation.items
      .map((item) => `${item.quantity} × ${item.inventory.masterProduct.productName}`)
      .join(', '),
    expiresLabel: dates.length > 0 ? formatDate(dates[0]) : '—',
    createdLabel: new Date(donation.createdAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: TIME_ZONE,
    }),
    status: donation.donationStatus,
  };
}

export function toUser(user: SessionApiUser): User {
  return {
    id: String(user.id),
    name: user.fullName,
    email: user.email,
    role: user.role === 'admin' ? 'admin' : 'household',
    points: 0,
    kgSaved: 0,
  };
}