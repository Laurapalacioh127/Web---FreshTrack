import Image from 'next/image';
import logoFresa from '@/assets/freshtrack-fresa.png';

export const Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 text-base font-semibold ${
      light ? 'text-white' : 'text-ink'
    }`}
  >
    <Image src={logoFresa} alt="" className="h-7 w-7" priority />
    FreshTrack
  </span>
);