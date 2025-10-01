"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server action to log out a user
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: "",
    maxAge: 0
  });

  redirect("/");
}
