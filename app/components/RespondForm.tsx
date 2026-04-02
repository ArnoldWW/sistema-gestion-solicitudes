"use client";

import { useState, useTransition } from "react";
import { respondRequest } from "@/actions/respondRequest";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RespondFormProps {
  requestId: string;
  currentResponse: string | null;
  currentStatus: string;
}

export default function RespondForm({
  requestId,
  currentResponse,
  currentStatus
}: RespondFormProps) {
  const router = useRouter();
  const [response, setResponse] = useState(currentResponse ?? "");
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!response.trim()) {
      toast.error("La respuesta no puede estar vacía");
      return;
    }

    startTransition(async () => {
      try {
        const result = await respondRequest(
          new FormData(e.target as HTMLFormElement)
        );
        if (!result.success) {
          throw new Error(result.error);
        }
        toast.success("Respuesta guardada exitosamente");
        // Redirect
        router.push("/dashboard/support");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="id" value={requestId} />

      <div>
        <label className="block text-sm font-medium">Respuesta</label>
        <textarea
          name="response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block rounded border-gray-300"
        >
          <option value="Abierto">Abierto</option>
          <option value="En progreso">En progreso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={isPending} className="btn">
          {isPending ? "Guardando..." : "Guardar respuesta"}
        </button>
      </div>
    </form>
  );
}
