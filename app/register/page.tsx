"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerUser } from "@/app/actions/registerUser";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENTE"
  });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await registerUser(form);
        if (!res.success) {
          throw new Error(res.error);
        }

        // Show success message
        alert("Registro exitoso");

        // Redirect to login page
        router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Error desconocido");
        }
      }
    });
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Crear usuario</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
        />

        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="CLIENTE">Cliente</option>
          <option value="SOPORTE">Soporte</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button type="submit" disabled={isPending} className="btn">
          {isPending ? "Registrando..." : "Registrarse"}
        </button>
        <small>
          ¿Ya tienes cuenta? <Link href="/">Inicia sesión aquí</Link>
        </small>
      </form>
    </main>
  );
}
