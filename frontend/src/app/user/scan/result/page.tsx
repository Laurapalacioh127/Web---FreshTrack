'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { AuthInput } from '@/components/AuthInput/AuthInput';

const ScanResultPage = () => {
  const [name, setName] = useState('Tomates cherry');
  const [quantity, setQuantity] = useState('350 g');
  const [category, setCategory] = useState('Verduras');
  const [expiry, setExpiry] = useState('En 3 días');

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link href="/user/scan" className="text-sm font-semibold">
        ← Volver al escáner
      </Link>
      <PageHeader
        eyebrow="ANÁLISIS COMPLETADO"
        title="¡Alimento detectado!"
        subtitle="Revisa la información antes de guardarla."
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
          94% de confianza
        </span>
        <p className="mt-3 text-2xl font-light">{name}</p>
        <p className="text-sm text-brand">Maduro, consumir en 3 días</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthInput label="Nombre del producto" placeholder="Tomates cherry" value={name} onChange={setName} />
        <AuthInput label="Cantidad" placeholder="350 g" value={quantity} onChange={setQuantity} />
        <AuthInput label="Categoría" placeholder="Verduras" value={category} onChange={setCategory} />
        <AuthInput label="Fecha de vencimiento sugerida" placeholder="En 3 días" value={expiry} onChange={setExpiry} />
      </div>

      <div className="flex gap-3">
        <Link
          href="/user/inventory"
          className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Guardar en inventario ✓
        </Link>
        <Link
          href="/user/scan"
          className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold"
        >
          Volver a escanear
        </Link>
      </div>
    </div>
  );
};

export default ScanResultPage;