"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

export async function loginUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }

    const result = await db.execute({
      sql: "SELECT id, name, email, role FROM users WHERE email = ? AND password = ? LIMIT 1",
      args: [email, password]
    });

    if (result.rows.length === 0) {
      return { success: false, error: "Credenciales inválidas" };
    }

    const userRow = result.rows[0];
    const userPayload = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role
    };

    // Validar que SECRET_KEY exista en producción
    if (!SECRET_KEY) {
      console.error("Falta JWT_SECRET en variables de entorno");
      return { success: false, error: "Error interno de configuración" };
    }

    const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1d" });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return { success: true, user: userPayload };
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      error: "Ocurrió un error en el servidor. Intenta nuevamente."
    };
  }
}
