import Link from "next/link";
import { z } from "zod";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { db } from "@/lib/db";
import FormattedDate from "@/app/components/FormattedDate";

const CustomerRequestsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    response: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
  })
);

async function getCustomerRequests(userId: string) {
  const result = await db.execute({
    sql: "SELECT id, title, description, status, response, created_at, updated_at FROM requests WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId]
  });

  const parsed = CustomerRequestsSchema.safeParse(result.rows);
  if (!parsed.success) {
    console.error(
      "Error al validar las solicitudes del cliente:",
      parsed.error
    );
    return [];
  }

  return parsed.data;
}

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

  const rows = await getCustomerRequests(user.id);

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

      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {rows.map((row) => (
          <li
            key={row.id}
            className="p-5 border border-gray-200 rounded-md relative"
          >
            <h3>{row.title}</h3>
            <p className="truncate text-gray-600">{row.description}</p>
            <p className="text-sm text-gray-500">
              ACTUALIZADO: <FormattedDate iso={row.updated_at} />
            </p>
            <p className="text-sm text-gray-500">
              CREADO: <FormattedDate iso={row.created_at} />
            </p>
            <Link
              href={`/dashboard/customer/${row.id}`}
              className="text-blue-500 underline mt-2 inline-block"
            >
              Ver detalles
            </Link>

            <span className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
              {row.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
