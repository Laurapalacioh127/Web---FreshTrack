'use client';

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextAreaField = ({ label, placeholder, value, onChange }: TextAreaFieldProps) => (
  <label className="flex flex-col gap-1 text-xs font-semibold">
    {label}
    <textarea
      rows={5}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-2xl border-2 border-transparent bg-cream px-4 py-3 text-sm font-normal outline-none transition focus:border-brand focus:bg-white"
    />
  </label>
);