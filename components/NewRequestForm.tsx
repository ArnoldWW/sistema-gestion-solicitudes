"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SupportUser } from "@/types";

type FormAction = (formData: FormData) => void | Promise<void>;

export default function NewRequestForm({ action }: { action?: FormAction }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createdAtRef = useRef<HTMLInputElement | null>(null);
  const [supportUsers, setSupportUsers] = useState<SupportUser[]>([]);
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
    const localIsoWithOffset = `${yyyy}-${mm}-${dd} / ${hh}:${min}`;
    createdAtRef.current.value = localIsoWithOffset;
  }, []);

  // fetch support users for the select
  useEffect(() => {
    let mounted = true;
    fetch("/api/support-users")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load support users");
        return res.json();
      })
      .then((data: SupportUser[]) => {
        if (mounted) setSupportUsers(data);
      })
      .catch(() => {
        // silent fail — select will be hidden
        setSupportUsers([]);
      });

    // cleanup
    return () => {
      mounted = false;
    };
  }, []);

  // Validate form fields
  const validate = () => {
    const e = {};
    if (!title.trim()) toast.error("El título es requerido");
    if (title.trim().length > 150)
      toast.error("El título es demasiado largo (máx. 150)");
    if (!description.trim()) toast.error("La descripción es requerida");
    if (description.trim().length > 5000)
      toast.error("La descripción es demasiado larga");
    if (!selectedSupport) toast.error("El soporte es requerido");

    return Object.keys(e).length === 0;
  };

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
