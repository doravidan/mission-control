import { NextResponse } from "next/server";
import { readdirSync, statSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const homedir = process.env.HOME || "/Users/devuser";
    const memoryDir = join(homedir, "clawd", "memory");

    const entries = readdirSync(memoryDir).filter((f) => f.endsWith(".md"));
    const files = entries.map((name) => {
      const fullPath = join(memoryDir, name);
      const stat = statSync(fullPath);
      return {
        name,
        path: fullPath,
        size: stat.size,
        modified: stat.mtime.toISOString().slice(0, 10),
      };
    });

    // Sort by modified date, newest first
    files.sort((a, b) => b.modified.localeCompare(a.modified));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to list memory files:", error);
    return NextResponse.json({ files: [] });
  }
}
