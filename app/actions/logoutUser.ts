"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: "",
    maxAge: 0
  });
}
