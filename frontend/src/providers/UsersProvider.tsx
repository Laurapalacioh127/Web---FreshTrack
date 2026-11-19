'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosProvider';
import type { User } from '@/types';

interface UsersContextType {
  users: User[];
  household: User | null;
  admin: User | null;
  loading: boolean;
  error: string | null;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const axios = useAxios();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const res = await axios.get<User[]>('/api/users');
        setUsers(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    onInit();
  }, [axios]);

  const household = users.find((user) => user.role === 'household') ?? null;
  const admin = users.find((user) => user.role === 'admin') ?? null;

  return (
    <UsersContext.Provider value={{ users, household, admin, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
};