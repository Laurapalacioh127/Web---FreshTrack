'use client';

import { createContext, ReactNode, useContext } from 'react';
import type { User } from '@/types';

interface UsersContextType {
  users: User[];
  household: User | null;
  admin: User | null;
  loading: boolean;
  error: string | null;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider = ({ user, children }: { user: User; children: ReactNode }) => {
  const value: UsersContextType = {
    users: [user],
    household: user.role === 'household' ? user : null,
    admin: user.role === 'admin' ? user : null,
    loading: false,
    error: null,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
};