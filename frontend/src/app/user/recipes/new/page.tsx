'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/providers/InventoryProvider';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PhotoDropzone } from '@/components/PhotoDropzone/PhotoDropzone';
import { AuthInput } from '@/components/AuthInput/AuthInput';
import { IngredientPicker } from '@/components/IngredientPicker/IngredientPicker';
import { TextAreaField } from '@/components/TextAreaField/TextAreaField';

const NewRecipePage = () => {
  const router = useRouter();
  const { items } = useInventory();
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [steps, setSteps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [servings, setServings] = useState('');

  const toggleIngredient = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((ingredient) => ingredient !== name) : [...prev, name]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/user/recipes/status');
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <PageHeader
        eyebrow="COMPARTE CON LA COMUNIDAD"
        title="Crear receta"
        subtitle="Convierte tus ingredientes en una idea que inspire."
      />
      <PhotoDropzone />
      <AuthInput
        label="Título de la receta"
        placeholder="Ej. Ensalada fresca de aprovechamiento"
        value={title}
        onChange={setTitle}
      />
      <IngredientPicker
        options={items.map((item) => item.name)}
        selected={selected}
        onToggle={toggleIngredient}
      />
      <TextAreaField
        label="Pasos de preparación"
        placeholder="1. Lava y corta los ingredientes…"
        value={steps}
        onChange={setSteps}
      />
      <div className="grid grid-cols-2 gap-4">
        <AuthInput label="Tiempo" placeholder="20 minutos" value={minutes} onChange={setMinutes} />
        <AuthInput label="Porciones" placeholder="2 personas" value={servings} onChange={setServings} />
      </div>
      <button
        type="submit"
        className="w-fit rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-6 py-3 text-sm font-semibold text-white"
      >
        Publicar receta en la comunidad →
      </button>
    </form>
  );
};

export default NewRecipePage;