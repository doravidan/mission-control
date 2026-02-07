import { NextResponse } from "next/server";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const homedir = process.env.HOME || "/Users/devuser";
    const memoryDir = join(homedir, "clawd", "memory");
    const memoryMd = join(homedir, "clawd", "MEMORY.md");

    const results: { file: string; matches: string[] }[] = [];

    // Search MEMORY.md
    try {
      const content = readFileSync(memoryMd, "utf-8");
      const lines = content.split("\n");
      const matches = lines
        .filter((l) => l.toLowerCase().includes(query))
        .slice(0, 3)
        .map((l) => l.trim().slice(0, 100));
      if (matches.length > 0) {
        results.push({ file: "MEMORY.md", matches });
      }
    } catch {
      // ignore
    }

    // Search memory/*.md
    const entries = readdirSync(memoryDir).filter((f) => f.endsWith(".md"));
    for (const name of entries) {
      try {
        const content = readFileSync(join(memoryDir, name), "utf-8");
        const lines = content.split("\n");
        const matches = lines
          .filter((l) => l.toLowerCase().includes(query))
          .slice(0, 3)
          .map((l) => l.trim().slice(0, 100));
        if (matches.length > 0) {
          results.push({ file: name, matches });
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
