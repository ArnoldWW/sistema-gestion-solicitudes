import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { SessionUser } from "../types";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return null;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(session.value, SECRET_KEY) as SessionUser;
    console.log(decoded);
    return decoded;
  } catch {
    return null;
  }
}
