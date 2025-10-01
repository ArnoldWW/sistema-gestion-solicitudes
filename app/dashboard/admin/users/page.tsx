import React from "react";
import { db } from "@/lib/db";
import { banUser } from "@/app/actions/banUser";

async function getAllUsers(role?: string) {
  let sql = "SELECT id, name, email, role, banned FROM users";
  const args: string[] = [];

  if (role && role !== "TODOS") {
    sql += " WHERE role = ?";
    args.push(role);
  }

  const result = await db.execute({ sql, args });
  return result.rows as unknown as {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: number;
  }[];
}

export default async function UsersAdminPage({
  searchParams
}: {
  searchParams: { role?: string };
}) {
  const { role } = await searchParams;
  const users = await getAllUsers(role);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

      <form method="get" className="flex items-center gap-2 mb-4">
        <select
          name="role"
          id="role"
          className="border p-2 rounded"
          defaultValue={role || "TODOS"}
        >
          <option value="TODOS">Todos</option>
          <option value="CLIENTE">Cliente</option>
          <option value="SOPORTE">Soporte</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit" className="btn">
          Filtrar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded border border-gray-200 flex flex-col gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-user"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Rol: {user.role}</p>
              <p>Estado: {user.banned === 1 ? "Baneado" : "Activo"}</p>
              <p>ID: {user.id}</p>
              {user.role === "ADMIN" ? (
                <p className="text-red-500">
                  No puedes banear a un administrador.
                </p>
              ) : (
                <form action={banUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    className={`btn ${
                      user.banned === 1 ? "bg-green-500" : "bg-red-500"
                    } text-white px-4 py-2 rounded mt-2`}
                  >
                    {user.banned === 1 ? "Desbanear" : "Banear"}
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
