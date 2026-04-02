import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
