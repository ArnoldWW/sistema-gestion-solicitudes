import Link from "next/link";
import type { RequestRow } from "@/types";
import FormattedDate from "@/components/FormattedDate";
import { getCurrentUser } from "@/lib/getCurrentUser";

interface RequestTableRowProps {
  row: RequestRow;
}

export default async function RequestTableRow({ row }: RequestTableRowProps) {
  const user = await getCurrentUser();

  console.log(row);

  return (
    <tr key={row.id} className="hover:bg-gray-50 text-sm">
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{row.title}</td>
      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis text-gray-500 max-w-xs truncate">
        {row.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded ${
            row.status === "Abierto"
              ? "bg-green-100 "
              : row.status === "En progreso"
              ? "bg-yellow-100"
              : row.status === "Resuelto"
              ? "bg-blue-100"
              : "bg-gray-100"
          }`}
        >
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded">
          {row.updated_at ? <FormattedDate iso={row.updated_at} /> : "—"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <Link href={`/dashboard/customer/${row.id}`}>Ver</Link>
        {user?.role === "SOPORTE" && (
          <Link href={`/dashboard/support/${row.id}`}>Responder</Link>
        )}
      </td>
    </tr>
  );
}
