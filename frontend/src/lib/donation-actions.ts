"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "./api";
import type { FormState } from "./inventory-actions";

export async function createDonation(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const ids = formData.getAll("inventoryId").map(Number);
  if (ids.length === 0) return { error: "Elige al menos un alimento para donar." };

  const items = ids.map((id) => ({
    inventoryId: id,
    quantity: Number(formData.get(`quantity-${id}`)),
  }));

  const response = await apiFetch("/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!response) return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  if (response.status === 400)
    return { error: "Revisa las cantidades: no pueden superar lo que tienes, y no se puede donar comida vencida." };
  if (response.status === 403 || response.status === 404)
    return { error: "Alguno de los alimentos ya no está disponible." };
  if (response.status !== 201) return { error: "No se pudo enviar la oferta." };

  revalidatePath("/user", "layout");
  redirect("/user/donate/status?created=1");
}

export async function reviewDonation(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isSafeInteger(id) || id < 1 || (status !== "accepted" && status !== "rejected")) {
    return { error: "Solicitud no válida." };
  }

  const response = await apiFetch(`/donations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response) return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  if (response.status === 403) return { error: "Solo un administrador puede revisar donaciones." };
  if (response.status === 409) return { error: "Esta oferta ya fue revisada." };
  if (response.status === 400)
    return { error: "No se pudo aceptar: el stock cambió o el alimento ya venció." };
  if (!response.ok) return { error: "No se pudo guardar la revisión." };

  revalidatePath("/admin", "layout");
  return null;
}
