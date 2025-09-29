import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return null;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(session.value, SECRET_KEY);
    return decoded;
  } catch {
    return null;
  }
}
