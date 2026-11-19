import type { InventoryItem, User } from '@/types';

type InventoryApiItem = {
  id: number;
  quantity: number;
  expirationDate: string;
  masterProduct: { productName: string; category: string };
};

type SessionApiUser = {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
};

const SOON_DAYS = 3;

function daysUntil(expirationDate: string): number {
  const [y, m, d] = expirationDate.slice(0, 10).split('-').map(Number);
  const todayText = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Bogota',
  });
  const [ty, tm, td] = todayText.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000);
}

export function toInventoryItem(item: InventoryApiItem): InventoryItem {
  const days = daysUntil(item.expirationDate);
  return {
    id: String(item.id),
    name: item.masterProduct.productName,
    category: item.masterProduct.category,
    quantity: `${item.quantity} ${item.quantity === 1 ? 'unidad' : 'unidades'}`,
    expiresInDays: days,
    status: days < 0 ? 'expired' : days <= SOON_DAYS ? 'soon' : 'ok',
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