"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

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

    // Support id optional, validate exists and role is SOPORTE
    let supportId = formData.get("support_id")?.toString() || null;

    const check = await db.execute({
      sql: "SELECT id, role FROM users WHERE id = ? LIMIT 1",
      args: [supportId]
    });
    if (!check.rows.length || check.rows[0].role !== "SOPORTE") {
      // invalid support id -> ignore (or return error)
      supportId = null;
    }

    // Prefer client-provided local datetime (ISO with offset) if present
    const createdAtClient = formData.get("created_at_local")?.toString();
    const createdAt = createdAtClient ?? new Date().toISOString(); // fallback UTC

    await db.execute({
      sql: `INSERT INTO requests
            (id, user_id, title, description, status, response, created_at, updated_at, support_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        user.id,
        title,
        description,
        "Abierto",
        null,
        createdAt,
        createdAt,
        supportId
      ]
    });

    return { success: true, id };
  } catch (err) {
    console.error("createRequest error:", err);
    return { success: false, error: "Error al crear la solicitud" };
  }
}

// Wrapper that returns void
export async function createRequestAction(formData: FormData): Promise<void> {
  const result = await createRequest(formData);
  if (result?.success && result.id) {
    redirect("/dashboard/customer");
  }
}
