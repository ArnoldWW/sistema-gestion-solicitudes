"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SupportUser } from "@/types";

type FormAction = (formData: FormData) => void | Promise<void>;

export default function NewRequestForm({
  action,
  supportUsers: initialSupportUsers
}: {
  action?: FormAction;
  supportUsers?: SupportUser[];
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createdAtRef = useRef<HTMLInputElement | null>(null);
  // use server-provided users as initial state
  const supportUsers = initialSupportUsers ?? [];
  const [selectedSupport, setSelectedSupport] = useState<string>("");

  // Set createdAt to current local datetime with timezone offset on mount
  useEffect(() => {
    if (!createdAtRef.current) return;
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    const localIsoWithOffset = `${yyyy}-${mm}-${dd}T${hh}:${min}:00${formatOffset(
      d
    )}`;
    createdAtRef.current.value = localIsoWithOffset;
  }, []);

  // helper to format timezone offset like +02:00
  function formatOffset(d: Date) {
    const offset = -d.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `${sign}${hh}:${mm}`;
  }

  // Validate form fields
  const validate = () => {
    let ok = true;
    if (!title.trim()) {
      toast.error("El título es requerido");
      ok = false;
    }
    if (title.trim().length > 150) {
      toast.error("El título es demasiado largo (máx. 150)");
      ok = false;
    }
    if (!description.trim()) {
      toast.error("La descripción es requerida");
      ok = false;
    }
    if (description.trim().length > 5000) {
      toast.error("La descripción es demasiado larga");
      ok = false;
    }
    if (!selectedSupport) {
      toast.error("Debes seleccionar un usuario de soporte");
      ok = false;
    }
    return ok;
  };

  // Handle form submission
  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Submit the form with ref
    formRef.current?.requestSubmit();
  };

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-2 mt-4 max-w-1/2"
    >
      <input type="hidden" name="created_at_local" ref={createdAtRef} />

      <label htmlFor="title">Título</label>
      <input
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Título"
        className="input"
      />

      {supportUsers.length > 0 ? (
        <>
          <label htmlFor="support">
            Asignar a soporte (aparecen los usuarios de soporte disponibles)
          </label>
          <select
            id="support"
            name="support_id"
            value={selectedSupport}
            onChange={(e) => setSelectedSupport(e.target.value)}
            className="input"
          >
            <option value="">-- Sin asignar --</option>
            {supportUsers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.email ? `(${s.email})` : ""}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>No hay usuarios de soporte disponibles</p>
      )}

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="input min-h-80"
      />

      <button onClick={handleSubmitClick} className="btn">
        Crear Solicitud
      </button>
    </form>
  );
}
