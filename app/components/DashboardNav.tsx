"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/types";

interface DashboardNavProps {
  links: SidebarLink[];
}

export default function DashboardNav({ links }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col mt-4 gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`p-2 rounded ${
            pathname === link.href
              ? "text-blue-500 bg-blue-200 hover:no-underline"
              : null
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
