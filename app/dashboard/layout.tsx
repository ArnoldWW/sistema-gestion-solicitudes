import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { Role, SidebarLink } from "@/types";
import { logoutUser } from "../actions/logoutUser";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

const linksByRole: Record<Role, SidebarLink[]> = {
  CLIENTE: [
    { href: "/dashboard/customer", label: "Mis Solicitudes" },
    { href: "/dashboard/customer/new", label: "Nueva Solicitud" }
  ],
  SOPORTE: [{ href: "/dashboard/support", label: "Solicitudes Asignadas" }],
  ADMIN: [
    { href: "/dashboard/admin", label: "Todas las Solicitudes" },
    { href: "/dashboard/admin/stats", label: "Estadísticas" },
    { href: "/dashboard/admin/users", label: "Usuarios" }
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
          <h1>Gestion de solicitudes</h1>
          <nav className="flex flex-col mt-4 gap-4">
            {linksByRole[user.role].map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <form action={logoutUser} className="flex flex-col gap-4">
          <p>
            Usuario: {user?.name} -{" "}
            <small className="text-neutral-500">{user?.role}</small>
          </p>

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
