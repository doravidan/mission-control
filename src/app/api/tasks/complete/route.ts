import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }

    execSync(`remindctl complete ${id}`, {
      encoding: "utf-8",
      timeout: 10000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to complete task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
