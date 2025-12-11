"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function banUser(formData: FormData) {
  const userId = formData.get("userId") as string;
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  try {
    // Get current status
    const userResult = await db.execute({
      sql: "SELECT banned FROM users WHERE id = ?",
      args: [userId]
    });

    if (!userResult.rows.length) {
      throw new Error("Usuario no encontrado");
    }

    const isBanned = (userResult.rows[0] as any).banned === 1;
    // Switch status
    const newBanned = isBanned ? 0 : 1;

    // Update
    await db.execute({
      sql: "UPDATE users SET banned = ? WHERE id = ?",
      args: [newBanned, userId]
    });

    // Refresh
    revalidatePath("/dashboard/admin/users");
  } catch {
    throw new Error("Error al actualizar usuario");
  }
}
