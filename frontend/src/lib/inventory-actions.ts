"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "./api";

export type FormState = { error: string } | null;

export async function createInventoryItem(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const response = await apiFetch("/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      masterProductId: Number(formData.get("masterProductId")),
      quantity: Number(formData.get("quantity")),
      expirationDate: String(formData.get("expirationDate") ?? ""),
    }),
  });

  if (!response) return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  if (response.status === 400)
    return { error: "Revisa los datos: cantidad de 1 a 1000 y una fecha válida." };
  if (response.status === 404) return { error: "Ese producto ya no existe en el catálogo." };
  if (response.status !== 201) return { error: "No se pudo guardar el alimento." };

  revalidatePath("/user", "layout");
  redirect("/user/inventory");
}

export async function deleteInventoryItem(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) redirect("/user/inventory");

  await apiFetch(`/inventory/${id}`, { method: "DELETE" });

  revalidatePath("/user", "layout");
  redirect("/user/inventory");
}