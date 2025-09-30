import { getCurrentUser } from "@/lib/getCurrentUser";
import { createRequestAction } from "@/app/actions/createRequest";
import NewRequestForm from "@/components/NewRequestForm";
import { db } from "@/lib/db";
import type { SupportUser } from "@/types";

export default async function NewCustomerRequestPage() {
  const user = await getCurrentUser();

  if (user?.role !== "CLIENTE") {
    return (
      <>
        <h2>Acceso denegado</h2>
        <p>No tienes permiso para crear una nueva solicitud.</p>
      </>
    );
  }

  // fetch support users for the dropdown
  const res = await db.execute({
    sql: "SELECT id, name, email FROM users WHERE role = ? ORDER BY name",
    args: ["SOPORTE"]
  });
  const supportUsers = (res.rows || []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? "",
    email: r.email ?? ""
  })) as SupportUser[];

  return (
    <div>
      <h2>Crear nueva solicitud</h2>

      {/* Pass supportUsers down to the client form */}
      <NewRequestForm
        action={createRequestAction}
        supportUsers={supportUsers}
      />
    </div>
  );
}
