import { Suspense } from 'react';
import { InventoryProvider } from '@/providers/InventoryProvider';
import { RecipesProvider } from '@/providers/RecipesProvider';
import { UsersProvider } from '@/providers/UsersProvider';
import { UserSidebar } from '@/components/UserSidebar/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UsersProvider>
      <InventoryProvider>
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