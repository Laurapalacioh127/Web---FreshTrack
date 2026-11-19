'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosProvider';
import type { Donation, DonationSummary } from '@/types';

interface DonationsContextType {
  donations: Donation[];
  summary: DonationSummary | null;
  loading: boolean;
  error: string | null;
}

const DonationsContext = createContext<DonationsContextType | null>(null);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const axios = useAxios();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const [donationsRes, summaryRes] = await Promise.all([
          axios.get<Donation[]>('/api/donations'),
          axios.get<DonationSummary>('/api/donations/summary'),
        ]);
        setDonations(donationsRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    onInit();
  }, [axios]);

  return (
    <DonationsContext.Provider value={{ donations, summary, loading, error }}>
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = () => {
  const ctx = useContext(DonationsContext);
  if (!ctx) throw new Error('useDonations must be used within DonationsProvider');
  return ctx;
};