import { getFoodEmoji } from '@/utils/foodEmoji';

interface ThumbProps {
  name: string;
  category?: string;
}

export const Thumb = ({ name, category }: ThumbProps) => (
  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun text-2xl shadow-soft">
    {getFoodEmoji(name, category)}
  </span>
);