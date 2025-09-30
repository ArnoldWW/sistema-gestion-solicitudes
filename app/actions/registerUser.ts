"use server";

import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      args: [
        nanoid(),
        formData.name,
        formData.email,
        hashedPassword,
        formData.role
      ]
    });

    return { success: true };
  } catch (err: any) {
    if (err?.message?.includes("UNIQUE")) {
      return { success: false, error: "El email ya está registrado" };
    }
    return { success: false, error: "Error al registrar el usuario" };
  }
}
