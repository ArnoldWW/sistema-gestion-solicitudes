import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { db } from "@/lib/db";
import type { RequestRow } from "@/types";
import FormattedDate from "@/components/FormattedDate";
import { redirect } from "next/navigation";
import RespondForm from "@/components/RespondForm";

async function getRequestById(id: string): Promise<RequestRow | null> {
  const res = await db.execute({
    sql: `SELECT r.id, r.user_id, u.name AS user_name, r.title, r.description, r.status, r.response, r.created_at, r.updated_at, r.support_id
          FROM requests r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.id = ? LIMIT 1`,
    args: [id]
  });

  if (!res || res.rows.length === 0) {
    return null;
  }

  const raw = res.rows[0] as any;
  return {
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
}

type SupportRequestDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function SupportRequestDetail({
  params
}: SupportRequestDetailProps) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6">
        <h2>No autenticado</h2>
      </div>
    );
  }

  const { id } = await params;
  const row = await getRequestById(id);

  // Request not found
  if (!row) {
    return (
      <div className="p-6">
        <h2>Solicitud no encontrada</h2>
        <Link href="/dashboard/support" className="text-blue-500 underline">
          Volver
        </Link>
      </div>
    );
  }

  // Only the assigned support user can view
  if (row.support_id !== user.id) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <Link href="/dashboard/support">&larr; Volver a Mis Solicitudes</Link>

      <h1 className="text-2xl font-bold mt-4">{row.title}</h1>
      <p className="text-sm">Solicitante: {row.user_name ?? row.user_id}</p>
      <p className="text-sm">
        Creado: {row.created_at ? <FormattedDate iso={row.created_at} /> : "—"}
      </p>
      <p className="text-sm">
        Actualizado:{" "}
        {row.updated_at ? <FormattedDate iso={row.updated_at} /> : "—"}
      </p>

      <div className="mt-6 bg-white border border-gray-200 rounded p-4">
        <h3 className="font-bold">Descripción</h3>
        <p className="mt-2 whitespace-pre-wrap">{row.description}</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold">Respuesta actual</h4>
            <div className="mt-1 text-sm">
              {row.response || <span className="text-gray-300">—</span>}
            </div>
          </div>

          <div>
            <h4 className="font-bold">Estado</h4>
            <div className="mt-1">{row.status}</div>
          </div>
        </div>

        {/* Form for support to respond/update status */}
        <div className="mt-6">
          <h4 className="font-bold mb-2">Responder / Actualizar estado</h4>
          <RespondForm
            requestId={row.id}
            currentResponse={row.response ?? null}
            currentStatus={row.status}
          />
        </div>
      </div>
    </div>
  );
}
