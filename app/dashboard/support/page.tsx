import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { db } from "@/lib/db";
import type { RequestRow } from "@/types";

export default async function SupportPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6">
        <h2>No autenticado</h2>
        <p>Inicia sesión para ver las solicitudes asignadas.</p>
      </div>
    );
  }

  if (user.role !== "SOPORTE") {
    return (
      <div className="p-6">
        <h2>Acceso denegado</h2>
        <p>No tienes permiso para ver el panel de soporte.</p>
      </div>
    );
  }

  // Query requests assigned to this support user, include requester name
  const result = await db.execute({
    sql: `SELECT r.id, r.user_id, u.name AS user_name, r.title, r.description, r.status, r.response, r.created_at, r.updated_at
          FROM requests r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.support_id = ?
          ORDER BY r.created_at DESC`,
    args: [user.id]
  });

  const rawRows = result.rows || [];

  const rows: RequestRow[] = (rawRows as any[]).map((r) => ({
    id: String(r.id),
    user_id: String(r.user_id),
    user_name: r.user_name ?? r.name ?? null,
    title: r.title ?? "",
    description: r.description ?? null,
    status: r.status ?? "",
    response: r.response ?? null,
    created_at: r.created_at ? String(r.created_at) : null,
    updated_at: r.updated_at ? String(r.updated_at) : null,
    support_id: r.support_id ? String(r.support_id) : null
  }));

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Solicitudes asignadas</h1>
        <p>No tienes solicitudes asignadas actualmente.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Solicitudes asignadas</h2>

      <div className="block overflow-x-auto bg-white rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Solicitante
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row: RequestRow) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {row.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {row.user_name ?? row.user_id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis text-gray-500 max-w-xs truncate">
                  {row.description}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded">
                    {row.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <Link
                    href={`/dashboard/support/${row.id}`}
                    className="btn hover:no-underline"
                  >
                    Responder
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
