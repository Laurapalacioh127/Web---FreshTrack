import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const TOKEN_COOKIE = "freshtrack_token";

export type SessionUser = {
  id: number;
  fullName: string;
  email: string;
  role: "user" | "admin";
};

export async function requireToken() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/");
  return token;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await requireToken();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${process.env.API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/");
  return response;
}

export async function requireRole(role: SessionUser["role"]) {
  const response = await apiFetch("/auth/me");
  const user: SessionUser | null = response?.ok
    ? await response.json().catch(() => null)
    : null;

  if (!user) redirect("/");
  if (user.role !== role) redirect(user.role === "admin" ? "/admin" : "/user");
  return user;
}

//requireToken: sin cookie, te devuelve a la pantalla de elegir rol.
//apiFetch: arma el Bearer y, si el backend responde 401 (sesión vencida), te lleva al inicio.
//requireRole: pregunta a /auth/me quién eres. Si entras a una zona que no es tu rol, te redirige a la tuya. 
// El backend sigue siendo quien rechaza con 403 las operaciones no permitidas.