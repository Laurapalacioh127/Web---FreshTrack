'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Portal } from '@/types';
import { portalTheme } from '@/utils/portalTheme';
import { AuthInput } from '@/components/AuthInput/AuthInput';

type Mode = 'login' | 'register';

const destinations: Record<Portal, string> = { user: '/user', admin: '/admin' };

export const AuthForm = ({ portal }: { portal: Portal }) => {
  const router = useRouter();
  const theme = portalTheme[portal];
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(destinations[portal]);
  };

  const tabClass = (tab: Mode) =>
    `flex-1 rounded-full py-2 text-xs font-semibold ${mode === tab ? 'bg-white shadow-sm' : 'text-neutral-500'}`;

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <div className="flex rounded-full bg-black/5 p-1">
        <button type="button" onClick={() => setMode('login')} className={tabClass('login')}>
          Iniciar sesión
        </button>
        <button type="button" onClick={() => setMode('register')} className={tabClass('register')}>
          Registrarme
        </button>
      </div>

      {mode === 'register' && (
        <AuthInput label="Nombre completo" placeholder="Valentina Ríos" value={name} onChange={setName} />
      )}
      <AuthInput label="Correo electrónico" type="email" placeholder="nombre@correo.com" value={email} onChange={setEmail} />
      <AuthInput label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={setPassword} />
      {mode === 'register' && (
        <AuthInput label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" value={confirm} onChange={setConfirm} />
      )}

      {mode === 'register' && portal === 'admin' && (
        <>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            Cargo
            <select className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm font-normal">
              <option>Coordinación de operaciones</option>
              <option>Logística de donaciones</option>
              <option>Nutrición y calidad</option>
            </select>
          </label>
          <p className="rounded-lg bg-ops-soft px-3 py-2 text-xs">Tu cuenta será validada por un administrador.</p>
        </>
      )}

      <button type="submit" className={`rounded-lg py-3 text-sm font-semibold text-white ${theme.submit}`}>
        {mode === 'login' ? 'Iniciar sesión →' : 'Crear cuenta →'}
      </button>

      <p className="text-center text-xs text-neutral-600">
        {mode === 'login' ? '¿Aún no tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className={`font-semibold ${theme.link}`}
        >
          {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </form>
  );
};