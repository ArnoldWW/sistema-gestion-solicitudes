import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT id, name, email FROM users WHERE role = ? ORDER BY name",
      args: ["SOPORTE"]
    });
    const rows = result.rows || [];
    return NextResponse.json(rows);
  } catch (err) {
    console.error("support-users error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
