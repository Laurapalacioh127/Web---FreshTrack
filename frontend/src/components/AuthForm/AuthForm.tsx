'use client';

import { useActionState, useState } from 'react';
import type { Portal } from '@/types';
import { portalTheme } from '@/utils/portalTheme';
import { AuthInput } from '@/components/AuthInput/AuthInput';
import { authenticate } from '@/lib/auth-actions';

type Mode = 'login' | 'register';

export const AuthForm = ({ portal }: { portal: Portal }) => {
  const theme = portalTheme[portal];
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, formAction, pending] = useActionState(authenticate, null);

  const canRegister = portal === 'user';

  const tabClass = (tab: Mode) =>
    `flex-1 rounded-full py-2 text-xs font-semibold ${mode === tab ? 'bg-white shadow-sm' : 'text-neutral-500'}`;

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="portal" value={portal} />

      {canRegister && (
        <div className="flex rounded-full bg-black/5 p-1">
          <button type="button" onClick={() => setMode('login')} className={tabClass('login')}>
            Iniciar sesión
          </button>
          <button type="button" onClick={() => setMode('register')} className={tabClass('register')}>
            Registrarme
          </button>
        </div>
      )}

      {mode === 'register' && (
        <AuthInput name="fullName" label="Nombre completo" placeholder="Valentina Ríos" value={name} onChange={setName} />
      )}
      <AuthInput name="email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" value={email} onChange={setEmail} />
      <AuthInput name="password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={setPassword} />
      {mode === 'register' && (
        <AuthInput name="confirm" label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" value={confirm} onChange={setConfirm} />
      )}

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`rounded-lg py-3 text-sm font-semibold text-white disabled:opacity-60 ${theme.submit}`}
      >
        {pending
          ? 'Un momento…'
          : mode === 'login'
            ? 'Iniciar sesión →'
            : 'Crear cuenta →'}
      </button>

      {pending && (
        <p className="text-center text-xs text-neutral-500">
          Si el servidor estaba dormido, la primera vez puede tardar hasta un minuto.
        </p>
      )}
    </form>
  );
};