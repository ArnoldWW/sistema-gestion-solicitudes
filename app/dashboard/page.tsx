import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  if (user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user?.role === "CLIENTE") {
    redirect("/dashboard/customer");
  }

  if (user?.role === "SOPORTE") {
    redirect("/dashboard/support");
  }
  return null;
}
