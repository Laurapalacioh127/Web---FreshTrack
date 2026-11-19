"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "./api";

export type AuthState = { error: string } | null;

export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const mode = formData.get("mode") === "register" ? "register" : "login";
  const portal = formData.get("portal") === "admin" ? "admin" : "user";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (mode === "register") {
    if (portal === "admin") {
      return { error: "Las cuentas de administrador las asigna el equipo." };
    }
    if (password !== String(formData.get("confirm") ?? "")) {
      return { error: "Las contraseñas no coinciden." };
    }
  }

  const body =
    mode === "register"
      ? { fullName: String(formData.get("fullName") ?? "").trim(), email, password }
      : { email, password };

  const response = await fetch(`${process.env.API_URL}/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!response) return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  if (response.status === 401) return { error: "Correo o contraseña incorrectos." };
  if (response.status === 409) return { error: "Ese correo ya está registrado." };
  if (response.status === 400)
    return { error: "Revisa los datos: correo válido y contraseña de 8 a 128 caracteres." };
  if (!response.ok) return { error: "El servidor tuvo un problema. Intenta más tarde." };

  const data = await response.json().catch(() => null);
  const token = data?.accessToken;
  const role = data?.user?.role;
  if (typeof token !== "string" || !token) {
    return { error: "Respuesta inesperada del servidor." };
  }
  if (portal === "admin" && role !== "admin") {
    return { error: "Esta cuenta no tiene acceso al portal de administración." };
  }

  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect(role === "admin" ? "/admin" : "/user");
}

export async function logout() {
  (await cookies()).delete(TOKEN_COOKIE);
  redirect("/");
}

//La cookie dura 1 hora (maxAge: 60 * 60) porque el JWT de ustedes dura 1 hora (según AUTH.md).
//redirect va al final y no dentro de try/catch. Así lo enseña el profe.
//El registro sí inicia sesión directamente, porque su backend devuelve el token al registrar.