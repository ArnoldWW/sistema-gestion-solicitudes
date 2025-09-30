"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions/loginUser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email y contraseña son requeridos");
      return;
    }

    startTransition(async () => {
      try {
        const res = await loginUser(email, password);
        console.log(res.user);

        if (!res?.success) {
          throw new Error(res.error);
        }

        // Show success message
        alert("Inicio de sesión exitoso");

        // Redirect to dashboard
        if (res.user?.role === "CLIENTE") {
          router.push("/dashboard/customer");
        } else if (res.user?.role === "SOPORTE") {
          router.push("/dashboard/support");
        } else if (res.user?.role === "ADMIN") {
          router.push("/dashboard/admin");
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error desconocido");
      }
    });
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Inicio de sesión</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button type="submit" disabled={isPending} className="btn">
          {isPending ? "Iniciando..." : "Iniciar sesión"}
        </button>

        <small>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-500 underline">
            Regístrate aquí
          </Link>
        </small>
      </form>
    </main>
  );
}
