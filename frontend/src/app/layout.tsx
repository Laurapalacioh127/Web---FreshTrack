import { Suspense } from 'react';
import { apiFetch, requireRole } from '@/lib/api';
import { toInventoryItem, toUser } from '@/lib/mappers';
import { InventoryProvider } from '@/providers/InventoryProvider';
import { RecipesProvider } from '@/providers/RecipesProvider';
import { UsersProvider } from '@/providers/UsersProvider';
import { UserSidebar } from '@/components/UserSidebar/UserSidebar';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('user');

  const response = await apiFetch('/inventory');
  const raw = response?.ok ? await response.json().catch(() => null) : null;
  const items = Array.isArray(raw) ? raw.map(toInventoryItem) : [];
  const error = Array.isArray(raw)
    ? null
    : 'No se pudo cargar tu inventario. Intenta de nuevo.';

  return (
    <UsersProvider user={toUser(session)}>
      <InventoryProvider items={items} error={error}>
        <RecipesProvider>
          <div className="flex min-h-screen">
            <Suspense fallback={<aside className="m-4 w-56 shrink-0 rounded-[2rem] bg-white shadow-soft" />}>
              <UserSidebar />
            </Suspense>
            <main className="flex-1 p-8">{children}</main>
          </div>
        </RecipesProvider>
      </InventoryProvider>
    </UsersProvider>
  );
}