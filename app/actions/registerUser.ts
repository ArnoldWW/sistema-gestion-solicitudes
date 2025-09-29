"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      args: [
        nanoid(),
        formData.name,
        formData.email,
        formData.password,
        formData.role
      ]
    });

    return { success: true };
  } catch (err: any) {
    if (err.message.includes("UNIQUE")) {
      return { success: false, error: "El email ya está registrado" };
    }
    return { success: false, error: "Error al registrar el usuario" };
  }
}
