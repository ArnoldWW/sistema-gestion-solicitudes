"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Get secret key from env variables
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Email y contraseña son requeridos" };
  }

  const result = await db.execute({
    sql: "SELECT id, name, email, role FROM users WHERE email = ? AND password = ? LIMIT 1",
    args: [email, password]
  });

  // If no user found
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

  // Create JWT token
  const token = jwt.sign(userPayload, SECRET_KEY, {
    expiresIn: "1d" // expires in 1 day
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 // 1 día
  });

  return { success: true };
}
