export default function Loading() {
  return (
    <div role="status" aria-label="Cargando" className="flex max-w-3xl animate-pulse flex-col gap-4">
      <div className="h-10 w-2/3 rounded-xl bg-black/10" />
      <div className="h-24 rounded-2xl bg-black/5" />
      <div className="h-24 rounded-2xl bg-black/5" />
    </div>
  );
}