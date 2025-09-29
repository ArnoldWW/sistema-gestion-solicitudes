"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions/loginUser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const res = await loginUser(email, password);

      if (!res.success) {
        alert(res.error);
        return;
      }

      console.log(res);
    });
  }

  return (
    <main>
      <form onSubmit={handleLogin}>
        <h1>Inicio de sesión</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={isPending}>
          {isPending ? "Iniciando..." : "Iniciar sesión"}
        </button>

        <p>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </form>
    </main>
  );
}
