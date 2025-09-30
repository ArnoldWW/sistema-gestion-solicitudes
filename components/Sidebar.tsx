"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((prev) => !prev);
  const pathname = usePathname();

  // Close the sidebar on route change (mobile).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 w-full p-6 bg-gray-50 flex justify-between flex-col min-h-screen overflow-auto transition-transform duration-100 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-80 md:static md:max-h-screen`}
      >
        {children}
      </aside>

      <button
        className="btn fixed md:hidden top-4 right-4 p-2 z-50 text-xs"
        onClick={toggleSidebar}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-menu"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 8l16 0" />
            <path d="M4 16l16 0" />
          </svg>
        )}
      </button>
    </>
  );
}
