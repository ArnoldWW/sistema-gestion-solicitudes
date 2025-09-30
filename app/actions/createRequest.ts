"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function createRequest(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "No autenticado" };

    const title = (formData.get("title") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();

    // Validate required fields
    if (!title) return { success: false, error: "El título es requerido" };
    if (!description)
      return { success: false, error: "La descripción es requerida" };

    const id = nanoid();

    await db.execute({
      sql: "INSERT INTO requests (id, user_id, title, description, status, response) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, user.id, title, description, "Abierto", null]
    });

    return { success: true, id };
  } catch (err: any) {
    console.error("createRequest error:", err);
    return { success: false, error: "Error al crear la solicitud" };
  }
}

// Wrapper that returns void so it can be used as a form `action`
export async function createRequestAction(formData: FormData): Promise<void> {
  await createRequest(formData);
}
