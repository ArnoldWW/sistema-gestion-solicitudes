"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

type FormAction = (formData: FormData) => void | Promise<void>;

export default function NewRequestForm({ action }: { action?: FormAction }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const validate = () => {
    const e = {};
    if (!title.trim()) toast.error("El título es requerido");
    if (title.trim().length > 150)
      toast.error("El título es demasiado largo (máx. 150)");
    if (!description.trim()) toast.error("La descripción es requerida");
    if (description.trim().length > 5000)
      toast.error("La descripción es demasiado larga");

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
      className="flex flex-col gap-4 mt-4 max-w-1/2"
    >
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Título"
        className="input"
      />

      <textarea
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
