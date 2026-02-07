import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync("remindctl list Eden 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });

    const tasks = output
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        // Format: [N] [x] Title [List] — due date
        const match = line.match(
          /^\[(\d+)\]\s+\[([ x])\]\s+(.+?)\s+\[Eden\](?:\s+—\s+(.+))?$/
        );
        if (!match) return null;
        return {
          id: match[1],
          completed: match[2] === "x",
          title: match[3].trim(),
          dueDate: match[4] && match[4] !== "no due date" ? match[4] : undefined,
          list: "Eden",
        };
      })
      .filter(Boolean);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ tasks: [], error: "Failed to fetch tasks" });
  }
}
