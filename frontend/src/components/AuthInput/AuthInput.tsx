'use client';

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const AuthInput = ({ label, type = 'text', placeholder, value, onChange }: AuthInputProps) => (
  <label className="flex flex-col gap-1 text-xs font-semibold">
    {label}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-2xl border-2 border-transparent bg-cream px-4 py-3 text-sm font-normal outline-none transition focus:border-brand focus:bg-white"
    />
  </label>
);