import { Suspense } from 'react';
import { DonationsProvider } from '@/providers/DonationsProvider';
import { ProductsProvider } from '@/providers/ProductsProvider';
import { RecipesProvider } from '@/providers/RecipesProvider';
import { UsersProvider } from '@/providers/UsersProvider';
import { AdminSidebar } from '@/components/AdminSidebar/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UsersProvider>
      <ProductsProvider>
        <DonationsProvider>
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