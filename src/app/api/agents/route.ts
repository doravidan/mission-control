import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface SessionEntry {
  sessionId: string;
  updatedAt: number;
  systemSent?: boolean;
  model?: string;
  contextTokens?: number;
}

export async function GET() {
  try {
    const homedir = process.env.HOME || "/Users/devuser";

    // Read sessions from OpenClaw
    const sessionsPath = join(
      homedir,
      ".openclaw",
      "agents",
      "eden",
      "sessions",
      "sessions.json"
    );

    // Also read subagent runs
    const subagentPath = join(homedir, ".openclaw", "subagents", "runs.json");

    const agents: {
      sessionId: string;
      label: string;
      status: string;
      startedAt: string;
      runtime: string;
      model?: string;
    }[] = [];

    // Sessions
    if (existsSync(sessionsPath)) {
      const data: Record<string, SessionEntry> = JSON.parse(
        readFileSync(sessionsPath, "utf-8")
      );
      for (const [key, session] of Object.entries(data)) {
        const age = Date.now() - session.updatedAt;
        const isRecent = age < 3600000; // 1 hour

        if (isRecent && key.includes("subagent")) {
          agents.push({
            sessionId: key,
            label: key.split(":").pop() || key,
            status: age < 300000 ? "running" : "idle",
            startedAt: new Date(session.updatedAt).toISOString(),
            runtime: formatDuration(age),
            model: session.model,
          });
        }
      }
    }

    // Subagent runs
    if (existsSync(subagentPath)) {
      try {
        const runs = JSON.parse(readFileSync(subagentPath, "utf-8"));
        const runEntries = Array.isArray(runs) ? runs : runs.runs || [];
        for (const run of runEntries) {
          if (run.status === "running" || (Date.now() - (run.startedAt || 0)) < 3600000) {
            const existing = agents.find((a) => a.sessionId === run.sessionId);
            if (!existing) {
              agents.push({
                sessionId: run.sessionId || run.id || "unknown",
                label: run.label || run.task?.slice(0, 40) || "Sub-agent",
                status: run.status || "unknown",
                startedAt: new Date(run.startedAt || Date.now()).toISOString(),
                runtime: formatDuration(Date.now() - (run.startedAt || Date.now())),
                model: run.model,
              });
            }
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json({ agents: [] });
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
