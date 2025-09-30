import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { db } from "@/lib/db";
import type { RequestRow } from "@/types";

export default async function CustomerRequestsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="p-6">
        <h2>No autenticado</h2>
        <p>Inicia sesión para ver tus solicitudes.</p>
      </div>
    );
  }

  // Query solicitudes for the current user
  const result = await db.execute({
    sql: "SELECT id, title, description, status, response, created_at, updated_at FROM requests WHERE user_id = ? ORDER BY created_at DESC",
    args: [user.id]
  });

  const rawRows = result.rows || [];

  const rows: RequestRow[] = (rawRows as any[]).map((r) => ({
    id: String(r.id),
    user_id: r.user_id ? String(r.user_id) : user.id,
    user_name: r.user_name ?? null,
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
        <h1 className="text-2xl font-semibold mb-4">Mis Solicitudes</h1>
        <p>No tienes solicitudes creadas aún.</p>
        <Link
          href="/dashboard/customer/new"
          className="text-blue-500 underline"
        >
          Crear una nueva solicitud
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Mis Solicitudes</h2>

      <div className="block overflow-x-auto bg-white rounded border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          {/* --- */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Título
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
          {/* --- */}
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row: RequestRow) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {row.title}
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
                    href={`/dashboard/customer/${row.id}`}
                    className="btn hover:no-underline"
                  >
                    Ver
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
