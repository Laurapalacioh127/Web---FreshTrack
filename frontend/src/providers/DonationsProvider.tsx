'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import type { Donation, DonationSummary } from '@/types';

interface DonationsContextType {
  donations: Donation[];
  summary: DonationSummary | null;
  loading: boolean;
  error: string | null;
}

const DonationsContext = createContext<DonationsContextType | null>(null);

interface DonationsProviderProps {
  donations: Donation[];
  error: string | null;
  children: ReactNode;
}

export const DonationsProvider = ({ donations, error, children }: DonationsProviderProps) => {
  const value = useMemo<DonationsContextType>(
    () => ({
      donations,
      summary: {
        kgRescued: 0,
        dailyGoalPercent: 0,
        families: 0,
        deliveries: donations.filter((donation) => donation.status === 'accepted').length,
        pendingDonations: donations.filter((donation) => donation.status === 'pending').length,
      },
      loading: false,
      error,
    }),
    [donations, error]
  );

  return <DonationsContext.Provider value={value}>{children}</DonationsContext.Provider>;
};

export const useDonations = () => {
  const ctx = useContext(DonationsContext);
  if (!ctx) throw new Error('useDonations must be used within DonationsProvider');
  return ctx;
};