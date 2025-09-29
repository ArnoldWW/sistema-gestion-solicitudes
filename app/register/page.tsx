"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerUser } from "@/app/actions/registerUser";

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
      const res = await registerUser(form);
      if (res.success) {
        alert("Registro exitoso");
        router.push("/");
      } else {
        alert(res.error);
      }
    });
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Registro</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="CLIENTE">Cliente</option>
          <option value="SOPORTE">Soporte</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button type="submit" disabled={isPending}>
          {isPending ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </main>
  );
}
