"use client";

import { useTransition } from "react";
import { banUser } from "@/app/actions/banUser";
import toast from "react-hot-toast";

interface BanUserButtonProps {
  userId: string;
  isBanned: boolean;
}

export default function BanUserButton({
  userId,
  isBanned
}: BanUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleBan = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("userId", userId);
        await banUser(formData);
        toast.success(isBanned ? "Usuario desbaneado" : "Usuario baneado");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al cambiar estado del usuario"
        );
      }
    });
  };

  return (
    <button
      onClick={handleBan}
      disabled={isPending}
      className={`btn ${
        isBanned ? "bg-green-500" : "bg-red-500"
      } text-white px-4 py-2 rounded mt-2 ${isPending ? "opacity-50" : ""}`}
    >
      {isPending ? "Cargando..." : isBanned ? "Desbanear" : "Banear"}
    </button>
  );
}
