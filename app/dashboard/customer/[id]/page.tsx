import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { db } from "@/lib/db";
import type { RequestRow } from "@/types";
import FormattedDate from "@/components/FormattedDate";

type RequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RequestDetailPage({
  params
}: RequestDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  // Query the request by ID
  const res = await db.execute({
    sql: "SELECT * FROM requests WHERE id = ? LIMIT 1",
    args: [id]
  });

  if (!res || res.rows.length === 0) {
    return (
      <div className="p-6">
        <h2>Solicitud no encontrada</h2>
        <Link href="/dashboard/customer" className="text-blue-500 underline">
          Volver
        </Link>
      </div>
    );
  }

  const raw = res.rows[0] as any;

  const row: RequestRow = {
    id: String(raw.id),
    user_id: raw.user_id ? String(raw.user_id) : "",
    user_name: raw.user_name ?? null,
    title: raw.title ?? "",
    description: raw.description ?? null,
    status: raw.status ?? "",
    response: raw.response ?? null,
    created_at: raw.created_at ? String(raw.created_at) : null,
    updated_at: raw.updated_at ? String(raw.updated_at) : null,
    support_id: raw.support_id ? String(raw.support_id) : null
  };

  // Authorization: owners and admins can view
  if (user?.role !== "ADMIN" && row.user_id !== user?.id) {
    return (
      <div className="p-6">
        <h2>No autorizado</h2>
        <p>No tienes permiso para ver esta solicitud.</p>
        <Link href="/dashboard" className="text-blue-500 underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div>
      {user?.role === "ADMIN" ? (
        <Link
          href="/dashboard/admin/requests"
          className="text-blue-500 underline"
        >
          &larr; Volver a todas las solicitudes
        </Link>
      ) : (
        <Link href="/dashboard/customer" className="text-blue-500 underline">
          &larr; Volver a mis solicitudes
        </Link>
      )}

      <h1 className="text-2xl font-bold mt-4">{row.title}</h1>
      <p className="text-sm">
        Creado: {row.created_at ? <FormattedDate iso={row.created_at} /> : "—"}
      </p>

      <div className="mt-6 bg-white border border-gray-200 rounded p-4">
        <h3 className="font-bold">Descripción</h3>
        <p className="mt-2 whitespace-pre-wrap">{row.description}</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-bold">Respuesta</h4>
            <div className="mt-1 text-sm">
              {row.response || <span className="text-gray-300">—</span>}
            </div>
          </div>

          <div>
            <h4 className="font-bold">Estado</h4>
            <div className="mt-1">{row.status}</div>
          </div>

          <div>
            <h4 className="font-bold">Última actualización</h4>
            <div className="mt-1 text-sm">
              {row.updated_at ? <FormattedDate iso={row.updated_at} /> : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
