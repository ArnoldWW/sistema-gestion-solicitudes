import React from "react";
import { db } from "@/lib/db";
import FormattedDate from "@/components/FormattedDate";

async function getAllRequests(status?: string) {
  let sql = `
    SELECT r.id, r.title, r.status, r.created_at, r.updated_at, u.name as user_name
    FROM requests r
    LEFT JOIN users u ON r.user_id = u.id
  `;
  const args: string[] = [];

  if (status && status !== "TODOS") {
    sql += " WHERE r.status = ?";
    args.push(status);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows as unknown as {
    id: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
    user_name: string;
  }[];
}

export default async function RequestsPage({
  searchParams
}: {
  searchParams: { status?: string };
}) {
  const { status } = await searchParams;
  const requests = await getAllRequests(status);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Todas las Solicitudes</h2>

      <form method="get" className="mb-4 flex items-center gap-2">
        <select name="status" id="status" defaultValue={status || "TODOS"}>
          <option value="TODOS">Todos</option>
          <option value="Abierto">Abierto</option>
          <option value="En progreso">En progreso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
        <button type="submit" className="btn">
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto rounded ">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left w-full">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4">Usuario</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Creado</th>
              <th className="py-2 px-4">Actualizado</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{request.id}</td>
                <td className="py-2 px-4">{request.title}</td>
                <td className="py-2 px-4">{request.user_name || "N/A"}</td>
                <td className="py-2 px-4">{request.status}</td>
                <td className="py-2 px-4">
                  {request.created_at ? (
                    <FormattedDate iso={request.created_at} />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2 px-4">
                  {request.updated_at ? (
                    <FormattedDate iso={request.updated_at} />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <a href={`/dashboard/customer/${request.id}`}>Ver</a>
                  <a href={`/dashboard/support/${request.id}`}>Responder</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
