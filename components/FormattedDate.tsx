"use client";

// Simple component to format ISO date strings in local format
export default function FormattedDate({ iso }: { iso?: string | null }) {
  if (!iso) return <span>—</span>;
  const d = new Date(iso);
  const formatted = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(d);
  return <span>{formatted}</span>;
}
