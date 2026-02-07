import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const homedir = process.env.HOME || "/Users/devuser";
    const tasksPath = join(homedir, "clawd", "TASKS.md");

    if (!existsSync(tasksPath)) {
      return NextResponse.json({ content: null });
    }

    const content = readFileSync(tasksPath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: null });
  }
}
