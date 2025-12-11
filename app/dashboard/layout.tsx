import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { Role, SidebarLink } from "@/types";
import { logoutUser } from "@/actions/logoutUser";
import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/DashboardNav";

const linksByRole: Record<Role, SidebarLink[]> = {
  CLIENTE: [
    { href: "/dashboard/customer", label: "Mis Solicitudes" },
    { href: "/dashboard/customer/new", label: "Nueva Solicitud" }
  ],
  SOPORTE: [{ href: "/dashboard/support", label: "Solicitudes Asignadas" }],
  ADMIN: [
    { href: "/dashboard/admin", label: "Estadísticas" },
    { href: "/dashboard/admin/users", label: "Usuarios" },
    { href: "/dashboard/admin/requests", label: "Todas las Solicitudes" }
  ]
};

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar>
        <div>
          <h1 className="flex flex-col items-start">
            <span className="text-sm block text-blue-500 bg-blue-200 p-1">
              {user.role}
            </span>
            Gestion de solicitudes
          </h1>
          <nav className="flex flex-col mt-4 gap-4">
            <DashboardNav links={linksByRole[user.role]} />
          </nav>
        </div>

        <form action={logoutUser} className="flex flex-col gap-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-user"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>

            <p>
              {user?.name} -{" "}
              <span className="text-blue-500">({user?.email})</span>
            </p>
          </div>

          <button type="submit" className="btn w-full">
            Cerrar sesión
          </button>
        </form>
      </Sidebar>

      <main className="flex-1 p-6 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
