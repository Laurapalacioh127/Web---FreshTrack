import { Suspense } from 'react';
import { apiFetch, requireRole } from '@/lib/api';
import { toDonation, toProduct, toUser } from '@/lib/mappers';
import { DonationsProvider } from '@/providers/DonationsProvider';
import { ProductsProvider } from '@/providers/ProductsProvider';
import { RecipesProvider } from '@/providers/RecipesProvider';
import { UsersProvider } from '@/providers/UsersProvider';
import { AdminSidebar } from '@/components/AdminSidebar/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar/AdminTopBar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('admin');

  const [donationsResponse, catalogResponse] = await Promise.all([
    apiFetch('/donations'),
    apiFetch('/catalog'),
  ]);

  const rawDonations = donationsResponse?.ok ? await donationsResponse.json().catch(() => null) : null;
  const rawCatalog = catalogResponse?.ok ? await catalogResponse.json().catch(() => null) : null;

  const donations = Array.isArray(rawDonations) ? rawDonations.map(toDonation) : [];
  const donationsError = Array.isArray(rawDonations)
    ? null
    : 'No se pudieron cargar las donaciones. Intenta de nuevo.';

  const products = Array.isArray(rawCatalog) ? rawCatalog.map(toProduct) : [];
  const productsError = Array.isArray(rawCatalog)
    ? null
    : 'No se pudo cargar el catálogo. Intenta de nuevo.';

  return (
    <UsersProvider user={toUser(session)}>
      <ProductsProvider products={products} error={productsError}>
        <DonationsProvider donations={donations} error={donationsError}>
          <RecipesProvider>
            <div className="flex min-h-screen flex-col md:flex-row">
              <Suspense fallback={<aside className="m-4 rounded-[2rem] bg-ink md:w-60" />}>
                <AdminSidebar />
              </Suspense>
              <div className="flex flex-1 flex-col">
                <AdminTopbar />
                <main className="flex-1 p-4 md:p-8">{children}</main>
              </div>
            </div>
          </RecipesProvider>
        </DonationsProvider>
      </ProductsProvider>
    </UsersProvider>
  );
}