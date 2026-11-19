import { Suspense } from 'react';
import { InventoryDetail } from '@/components/InventoryDetail/InventoryDetail';

const InventoryDetailPage = () => (
  <Suspense fallback={<p>Cargando alimento…</p>}>
    <InventoryDetail />
  </Suspense>
);

export default InventoryDetailPage;