import React from "react";
import { db } from "@/lib/db";

async function getUserStats() {
  const result = await db.execute({
    sql: "SELECT role, COUNT(*) as count FROM users GROUP BY role",
    args: []
  });
  return result.rows as unknown as { role: string; count: number }[];
}

async function getRequestStats() {
  const result = await db.execute({
    sql: "SELECT status, COUNT(*) as count FROM requests GROUP BY status",
    args: []
  });
  return result.rows as unknown as { status: string; count: number }[];
}

export default async function AdminPage() {
  const userStats = await getUserStats();
  const requestStats = await getRequestStats();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
      <p className="mb-6">Estadísticas generales del sistema</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <h3 className="text-xl font-semibold col-span-full mb-2">
          Usuarios Registrados por Rol
        </h3>
        {userStats.map((stat) => (
          <div key={stat.role} className="bg-blue-100 p-4 rounded-lg">
            <h4 className="text-lg font-medium">{stat.role}</h4>
            <p className="text-2xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h3 className="text-xl font-semibold col-span-full mb-2">
          Solicitudes por Estado
        </h3>
        {requestStats.map((stat) => (
          <div key={stat.status} className="bg-green-100 p-4 rounded-lg">
            <h4 className="text-lg font-medium">{stat.status}</h4>
            <p className="text-2xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>
    </>
  );
}
