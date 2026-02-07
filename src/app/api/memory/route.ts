import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const homedir = process.env.HOME || "/Users/devuser";
    const memoryPath = join(homedir, "clawd", "MEMORY.md");

    if (!existsSync(memoryPath)) {
      return NextResponse.json({ content: "MEMORY.md not found" });
    }

    const content = readFileSync(memoryPath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to read MEMORY.md:", error);
    return NextResponse.json({ content: "Error reading MEMORY.md" });
  }
}
