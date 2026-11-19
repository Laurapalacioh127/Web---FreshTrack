'use client';

import { useState } from 'react';
import { AuthInput } from '@/components/AuthInput/AuthInput';

export const NewProductModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [storage, setStorage] = useState('');
  const [substitutes, setSubstitutes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-light">Nuevo producto maestro</h2>
        <p className="text-sm text-neutral-600">Agrega un alimento al catálogo central.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <AuthInput label="Nombre" placeholder="Nombre del producto" value={name} onChange={setName} />
          <AuthInput label="Categoría" placeholder="Selecciona una categoría" value={category} onChange={setCategory} />
          <AuthInput label="Días de vida útil" placeholder="Ej. 7 días" value={shelfLife} onChange={setShelfLife} />
          <AuthInput label="Condiciones de conservación" placeholder="Refrigerado entre 3 °C y 5 °C" value={storage} onChange={setStorage} />
        </div>
        <AuthInput label="Sustitutos" placeholder="Buscar productos sustitutos" value={substitutes} onChange={setSubstitutes} />
        <div className="flex gap-3">
          <button type="submit" className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-5 py-2.5 text-sm font-semibold text-white">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => onClose()}
            className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};