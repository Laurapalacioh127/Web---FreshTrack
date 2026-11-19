'use client';

interface SearchBoxProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchBox = ({ placeholder, value, onChange }: SearchBoxProps) => (
  <input
    type="search"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-full border-2 border-transparent bg-white px-5 py-3 text-sm shadow-soft outline-none transition focus:border-brand"
  />
);