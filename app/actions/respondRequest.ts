"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

// Server action to respond to a support request
export async function respondRequest(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const id = formData.get("id")?.toString();
  const response = formData.get("response")?.toString();
  const status = formData.get("status")?.toString();

  if (!id) {
    return { success: false, error: "Falta id de la solicitud" };
  }

  // Ensure that the request exists and is assigned to this support user (unless admin)
  const res = await db.execute({
    sql: "SELECT support_id FROM requests WHERE id = ? LIMIT 1",
    args: [id]
  });

  const rows = res.rows || [];
  if (rows.length === 0) {
    return { success: false, error: "Solicitud no encontrada" };
  }

  const row = rows[0];
  const supportId = row.support_id ? String(row.support_id) : null;

  if (supportId !== user.id) {
    return {
      success: false,
      error: "No autorizado para responder esta solicitud"
    };
  }

  try {
    const updatedDate = new Date().toISOString();
    const updates: string[] = [];
    const args: any[] = [];

    if (response !== null) {
      updates.push("response = ?");
      args.push(response);
    }

    if (status !== null) {
      updates.push("status = ?");
      args.push(status);
    }

    updates.push("updated_at = ?");
    args.push(updatedDate);

    if (updates.length === 0) {
      return { success: false, error: "Nada que actualizar" };
    }

    // Build sql
    const sql = `UPDATE requests SET ${updates.join(", ")} WHERE id = ?`;
    args.push(id);

    await db.execute({ sql, args });

    return { success: true };
  } catch (err: any) {
    console.error("respondRequest error:", err);
    return { success: false, error: "Error actualizando la solicitud" };
  }
}

// wrapper for form action
export async function respondRequestAction(formData: FormData) {
  return await respondRequest(formData);
}
