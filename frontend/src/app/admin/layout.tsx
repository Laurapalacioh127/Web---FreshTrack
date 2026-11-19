import { Suspense } from 'react';
import { apiFetch, requireRole } from '@/lib/api';
import { toDonation, toUser } from '@/lib/mappers';
import { DonationsProvider } from '@/providers/DonationsProvider';
import { ProductsProvider } from '@/providers/ProductsProvider';
import { RecipesProvider } from '@/providers/RecipesProvider';
import { UsersProvider } from '@/providers/UsersProvider';
import { AdminSidebar } from '@/components/AdminSidebar/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar/AdminTopBar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('admin');

  const response = await apiFetch('/donations');
  const raw = response?.ok ? await response.json().catch(() => null) : null;
  const donations = Array.isArray(raw) ? raw.map(toDonation) : [];
  const donationsError = Array.isArray(raw)
    ? null
    : 'No se pudieron cargar las donaciones. Intenta de nuevo.';

  return (
    <UsersProvider user={toUser(session)}>
      <ProductsProvider>
        <DonationsProvider donations={donations} error={donationsError}>
          <RecipesProvider>
            <div className="flex min-h-screen">
              <Suspense fallback={<aside className="m-4 w-60 shrink-0 rounded-[2rem] bg-ink" />}>
                <AdminSidebar />
              </Suspense>
              <div className="flex flex-1 flex-col">
                <AdminTopbar />
                <main className="flex-1 p-8">{children}</main>
              </div>
            </div>
          </RecipesProvider>
        </DonationsProvider>
      </ProductsProvider>
    </UsersProvider>
  );
}