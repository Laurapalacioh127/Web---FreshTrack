interface DetailFieldProps {
  label: string;
  value: string;
}

export const DetailField = ({ label, value }: DetailFieldProps) => (
  <div className="rounded-xl border border-black/5 bg-white p-4">
    <p className="text-xs text-neutral-500">{label}</p>
    <p className="mt-1 font-semibold">{value}</p>
  </div>
);