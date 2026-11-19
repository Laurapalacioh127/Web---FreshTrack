'use client';

import axios, { AxiosInstance } from 'axios';
import { createContext, ReactNode, useContext, useMemo } from 'react';

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const instance = useMemo(() => {
    const inst = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    });

    inst.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.message ?? 'Ocurrió un error inesperado';
        return Promise.reject(new Error(message));
      }
    );

    return inst;
  }, []);

  return (
    <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>
  );
};

export const useAxios = () => {
  const ctx = useContext(AxiosContext);
  if (!ctx) throw new Error('useAxios must be used within AxiosProvider');
  return ctx;
};