"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((prev) => !prev);
  const pathname = usePathname();

  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the sidebar on route change (mobile) but only after mount
  useEffect(() => {
    if (mounted) setOpen(false);
  }, [pathname, mounted]);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 w-full p-6 bg-gray-50 flex justify-between flex-col min-h-screen overflow-auto transition-transform duration-150 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-80 md:static md:max-h-screen`}
      >
        {children}
      </aside>

      {mounted && (
        <>
          {/* overlay */}
          {open && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
          )}

          <button
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="btn fixed top-4 right-4 p-2 z-50 text-xs bg-blue-500"
            onClick={toggleSidebar}
          >
            {open ? (
              /* close icon */
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
                className="icon icon-tabler icon-tabler-x"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              /* menu icon */
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
                className="icon icon-tabler icon-tabler-menu"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 8l16 0" />
                <path d="M4 16l16 0" />
              </svg>
            )}
          </button>
        </>
      )}
    </>
  );
}
