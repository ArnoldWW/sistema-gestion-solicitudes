import { getCurrentUser } from "@/lib/getCurrentUser";
import { createRequestAction } from "@/app/actions/createRequest";
import NewRequestForm from "@/components/NewRequestForm";

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

  return (
    <div>
      <h2>Crear nueva solicitud</h2>

      {/* Client-side validated form which submits to the server action */}
      <NewRequestForm action={createRequestAction} />
    </div>
  );
}
