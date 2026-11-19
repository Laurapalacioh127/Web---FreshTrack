export type Portal = 'user' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: string;
  shelfLifeDays: number;
  substitutes: string[];
}

export type InventoryStatus = 'ok' | 'soon' | 'expired';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  expiresInDays: number;
  status: InventoryStatus;
}

export interface InventorySummary {
  registered: number;
  expiringSoon: number;
  expired: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  reason: string;
  checked: boolean;
}

export type RecipeStatus = 'pending' | 'approved' | 'rejected';

export interface Recipe {
  id: string;
  title: string;
  author: string;
  minutes: number;
  difficulty: string;
  servings: number;
  ingredientsAvailable: number;
  ingredientsTotal: number;
  status: RecipeStatus;
  ingredients: string[];
  steps: string[];
}

export type DonationStatus = 'pending' | 'approved' | 'completed';

export interface Donation {
  id: string;
  donorName: string;
  zone: string;
  items: string;
  expiresLabel: string;
  status: DonationStatus;
}

export interface DonationSummary {
  kgRescued: number;
  dailyGoalPercent: number;
  families: number;
  deliveries: number;
  pendingDonations: number;
}

export type UserRole = 'household' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  kgSaved: number;
}