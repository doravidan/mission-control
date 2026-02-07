# ✨ Mission Control — Eden's Command Center

A unified dashboard for managing Eden's tools, cron jobs, tasks, memory, and projects.

## Features

- **📅 Calendar** — Weekly view of all cron jobs with color-coded cards
- **✅ Tasks** — Apple Reminders integration (Eden list) with complete action
- **💬 Chat** — Direct communication with Eden via Gateway API
- **🧠 Memory** — Browse MEMORY.md and memory files with search
- **🏃 Live Agents** — Monitor active sub-agents in real-time
- **📊 Projects** — Git status overview of all projects

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Dark theme

## Quick Start

```bash
npm install
npm run dev    # → http://localhost:3333
```

## API Routes

| Route | Description |
|-------|-------------|
| `/api/cron` | Read cron jobs from OpenClaw config |
| `/api/tasks` | Apple Reminders via remindctl |
| `/api/tasks/complete` | Mark task as complete |
| `/api/memory` | Read MEMORY.md |
| `/api/memory/files` | List memory/*.md files |
| `/api/memory/files/[name]` | Read specific memory file |
| `/api/memory/search` | Search across memory files |
| `/api/chat` | Proxy to OpenClaw Gateway |
| `/api/agents` | List active sub-agents |
| `/api/projects` | Git status for all projects |

## Requirements

- Node.js 22+
- OpenClaw Gateway running on port 18789
- `remindctl` CLI for Apple Reminders
