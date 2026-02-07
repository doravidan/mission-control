import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    // Read from OpenClaw cron jobs file
    const homedir = process.env.HOME || "/Users/devuser";
    const jobsPath = join(homedir, ".openclaw", "cron", "jobs.json");
    const data = JSON.parse(readFileSync(jobsPath, "utf-8"));

    const jobs = (data.jobs || []).map(
      (j: {
        id: string;
        name: string;
        enabled: boolean;
        schedule: { expr: string; tz: string };
        state?: { nextRunAtMs?: number };
      }) => ({
        id: j.id,
        name: j.name,
        enabled: j.enabled,
        schedule: j.schedule,
        nextRunAtMs: j.state?.nextRunAtMs,
      })
    );

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to read cron jobs:", error);
    return NextResponse.json([], { status: 200 });
  }
}
