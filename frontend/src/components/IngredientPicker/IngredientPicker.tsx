'use client';

interface IngredientPickerProps {
  options: string[];
  selected: string[];
  onToggle: (name: string) => void;
}

export const IngredientPicker = ({ options, selected, onToggle }: IngredientPickerProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-xs font-semibold">Ingredientes de tu inventario</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            selected.includes(option) ? 'bg-brand text-white' : 'bg-white'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);