'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/providers/InventoryProvider';
import { AuthInput } from '@/components/AuthInput/AuthInput';
import { TextAreaField } from '@/components/TextAreaField/TextAreaField';
import { DonationItemRow } from '@/components/DonationItemRow/DonationItemRow';

const DonatePage = () => {
  const router = useRouter();
  const { items, loading, error } = useInventory();
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');

  if (loading) return <p>Cargando tus alimentos…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const donable = items
    .filter((item) => item.status === 'soon')
    .sort((a, b) => a.expiresInDays - b.expiresInDays)
    .slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/user/donate/status');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-light">¿Donar estos {donable.length} productos?</h1>
      <p className="text-sm text-neutral-600">
        Ayúdalos a llegar a una familia antes de que venzan.
      </p>

      {donable.length === 0 ? (
        <p className="rounded-2xl bg-brand-soft p-4 text-sm">
          No tienes alimentos por vencer para donar en este momento.
        </p>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-sun/40 p-4">
          {donable.map((item) => (
            <DonationItemRow key={item.id} item={item} />
          ))}
        </div>
      )}

      <AuthInput
        label="Lugar de recogida"
        placeholder="Calle 8 #34-20, Cali"
        value={place}
        onChange={setPlace}
      />
      <TextAreaField
        label="Nota opcional"
        placeholder="Indicaciones para la recolección"
        value={note}
        onChange={setNote}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Confirmar donación ♡
        </button>
        <Link
          href="/user/inventory"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
};

export default DonatePage;