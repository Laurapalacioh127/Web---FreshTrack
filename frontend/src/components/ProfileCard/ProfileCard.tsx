import type { User } from '@/types';
import { formatKg, getInitials } from '@/utils/format';

export const ProfileCard = ({ user }: { user: User }) => (
  <section className="flex flex-col items-center gap-2 rounded-3xl bg-white p-8 text-center shadow-sm">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sun text-lg font-semibold">
      {getInitials(user.name)}
    </span>
    <p className="font-semibold">{user.name}</p>
    <p className="text-sm text-neutral-600">{user.email}</p>
    <p className="mt-2 text-sm">
      <strong>{user.points}</strong> puntos · <strong>{formatKg(user.kgSaved)}</strong> kg salvados
    </p>
  </section>
);