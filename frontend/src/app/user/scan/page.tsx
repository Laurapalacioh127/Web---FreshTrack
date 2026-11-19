import Link from 'next/link';
import { ScannerViewfinder } from '@/components/ScannerViewfinder/ScannerViewfinder';

const ScanPage = () => (
  <section className="flex min-h-[80vh] flex-col rounded-3xl bg-ink p-6 text-white">
    <div className="flex items-center justify-between text-sm">
      <Link href="/user" aria-label="Cerrar escáner" className="text-xl">
        ✕
      </Link>
      <div className="text-center">
        <p className="font-semibold">Escáner con IA</p>
        <p className="text-xs text-white/60">Identificación inteligente</p>
      </div>
      <span className="text-xs font-semibold tracking-widest text-white/60">FLASH</span>
    </div>

    <div className="flex flex-1 items-center justify-center">
      <ScannerViewfinder />
    </div>

    <div className="flex flex-col items-center gap-3 text-center">
      <p className="font-semibold">Centra el alimento</p>
      <p className="text-xs text-white/60">Procura tener buena iluminación</p>
      <Link href="/user/scan/result" className="rounded-full bg-brand shadow-glow-brand transition hover:-translate-y-0.5 px-6 py-3 text-sm font-semibold">
        Escanear alimento con IA
      </Link>
      <Link href="/user/scan/result" className="text-sm text-white/80">
        Agregar manualmente
      </Link>
    </div>
  </section>
);

export default ScanPage;