import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

interface ProjectDef {
  name: string;
  path: string;
  description: string;
}

const PROJECTS: ProjectDef[] = [
  { name: "wheel2go", path: "~/dev/wheel2go", description: "Car rental platform" },
  { name: "trading-companion", path: "~/dev/trading-companion", description: "Trading microservices" },
  { name: "ai-fight-club", path: "~/dev/ai-fight-club", description: "Bot battle arena" },
  { name: "yodayika-online-store", path: "~/dev/yodayika-online-store", description: "E-commerce" },
  { name: "little-pages", path: "~/dev/little-pages", description: "Little Pages" },
  { name: "mission-control", path: "~/dev/mission-control", description: "Eden's command center" },
  { name: "eden-dashboard", path: "~/dev/eden-dashboard", description: "Eden Dashboard" },
  { name: "invoice-gpt", path: "~/dev/invoice-gpt", description: "Invoice processing" },
  { name: "ai-virtual-try-on", path: "~/dev/ai-virtual-try-on", description: "AITryon app" },
  { name: "devpilot", path: "~/dev/devpilot", description: "DevPilot fork" },
];

function expandPath(p: string): string {
  const homedir = process.env.HOME || "/Users/devuser";
  return p.replace("~", homedir);
}

function getGitInfo(dirPath: string): {
  branch: string;
  lastCommit: string;
  lastCommitDate: string;
  dirty: boolean;
} {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: dirPath,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    const lastCommit = execSync('git log -1 --pretty=format:"%s"', {
      cwd: dirPath,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    const lastCommitDate = execSync('git log -1 --pretty=format:"%cr"', {
      cwd: dirPath,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    const status = execSync("git status --porcelain", {
      cwd: dirPath,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    return {
      branch,
      lastCommit,
      lastCommitDate,
      dirty: status.length > 0,
    };
  } catch {
    return {
      branch: "unknown",
      lastCommit: "N/A",
      lastCommitDate: "N/A",
      dirty: false,
    };
  }
}

export async function GET() {
  try {
    const projects = PROJECTS.map((p) => {
      const fullPath = expandPath(p.path);
      const exists = existsSync(fullPath);
      const gitInfo = exists ? getGitInfo(fullPath) : {
        branch: "-",
        lastCommit: "-",
        lastCommitDate: "-",
        dirty: false,
      };

      return {
        name: p.name,
        path: p.path,
        description: p.description,
        exists,
        ...gitInfo,
      };
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ projects: [] });
  }
}
