'use client';

import { useActionState } from 'react';
import { reviewDonation } from '@/lib/donation-actions';

export const DonationReviewActions = ({ id }: { id: string }) => {
  const [state, formAction, pending] = useActionState(reviewDonation, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="submit"
          name="status"
          value="accepted"
          disabled={pending}
          className="rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-glow-brand transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? 'Guardando…' : 'Aceptar oferta'}
        </button>
        <button
          type="submit"
          name="status"
          value="rejected"
          disabled={pending}
          className="rounded-lg border border-black/10 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          Rechazar
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
};