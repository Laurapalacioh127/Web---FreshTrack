import Image from 'next/image';
import { photoUrls } from '@/utils/photos';

interface PhotoProps {
  src: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export const Photo = ({ src, sizes, className = '', priority = false }: PhotoProps) => {
  const resolved = photoUrls[src] || src;

  return (
    <Image
      src={resolved}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={resolved.startsWith('http')}
      className={`object-cover ${className}`}
    />
  );
};