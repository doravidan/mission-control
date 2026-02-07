"use client";

import { useEffect, useState } from "react";

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    expr: string;
    tz: string;
  };
  nextRunAtMs?: number;
}

interface JobDisplay {
  name: string;
  time: string;
  days: number[];
  color: string;
  icon: string;
  enabled: boolean;
}

const JOB_STYLES: Record<string, { color: string; icon: string }> = {
  "ai-research-daily": { color: "bg-purple-500/20 border-purple-500/40 text-purple-300", icon: "🔬" },
  "morning-brief-6am": { color: "bg-green-500/20 border-green-500/40 text-green-300", icon: "🌅" },
  "daily-podcast-briefing": { color: "bg-blue-500/20 border-blue-500/40 text-blue-300", icon: "🎙️" },
  "daily-linkedin-post": { color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300", icon: "💼" },
  "profit-scan-10am": { color: "bg-orange-500/20 border-orange-500/40 text-orange-300", icon: "💰" },
  "profit-scan-2pm": { color: "bg-orange-500/20 border-orange-500/40 text-orange-300", icon: "💰" },
  "profit-scan-6pm": { color: "bg-orange-500/20 border-orange-500/40 text-orange-300", icon: "💰" },
  "afternoon-research-report": { color: "bg-violet-500/20 border-violet-500/40 text-violet-300", icon: "📊" },
  "nightly-coding-session": { color: "bg-red-500/20 border-red-500/40 text-red-300", icon: "💻" },
  "motzei-shabbat-brief": { color: "bg-amber-500/20 border-amber-500/40 text-amber-300", icon: "🕯️" },
  "weekly-self-improvement": { color: "bg-pink-500/20 border-pink-500/40 text-pink-300", icon: "🧠" },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_HEB = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function parseCronDays(expr: string): number[] {
  const parts = expr.split(" ");
  const dayField = parts[4]; // cron: min hour dom month dow
  if (dayField === "*") return [0, 1, 2, 3, 4, 5, 6];
  
  const days: number[] = [];
  dayField.split(",").forEach((segment) => {
    if (segment.includes("-")) {
      const [start, end] = segment.split("-").map(Number);
      for (let i = start; i <= end; i++) days.push(i);
    } else {
      days.push(Number(segment));
    }
  });
  return days;
}

function parseCronTime(expr: string): string {
  const parts = expr.split(" ");
  const hour = parts[1].padStart(2, "0");
  const min = parts[0].padStart(2, "0");
  return `${hour}:${min}`;
}

function formatJobName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/(\d+)(am|pm)/gi, "$1 $2");
}

export default function CalendarView() {
  const [jobs, setJobs] = useState<JobDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cron")
      .then((r) => r.json())
      .then((data: CronJob[]) => {
        const mapped: JobDisplay[] = data.map((j) => ({
          name: formatJobName(j.name),
          time: parseCronTime(j.schedule.expr),
          days: parseCronDays(j.schedule.expr),
          color: JOB_STYLES[j.name]?.color || "bg-gray-500/20 border-gray-500/40 text-gray-300",
          icon: JOB_STYLES[j.name]?.icon || "⚙️",
          enabled: j.enabled,
        }));
        mapped.sort((a, b) => a.time.localeCompare(b.time));
        setJobs(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94a3b8]">Loading schedule...</div>
      </div>
    );
  }

  // Always running section
  const alwaysRunning = [
    { name: "OpenClaw Gateway", status: "Running", icon: "🔌", port: "18789" },
    { name: "Telegram Bot", status: "Connected", icon: "📱", port: "" },
    { name: "Cron Scheduler", status: "Active", icon: "⏰", port: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Always Running */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-glow"></span>
          Always Running
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {alwaysRunning.map((service) => (
            <div
              key={service.name}
              className="bg-[#16213e] border border-[#10b981]/30 rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <span className="text-xl">{service.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{service.name}</p>
                <p className="text-xs text-[#10b981]">
                  {service.status}
                  {service.port && ` :${service.port}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">📅 Weekly Schedule</h2>
        <div className="grid grid-cols-7 gap-3">
          {DAY_NAMES.map((day, dayIndex) => {
            const dayJobs = jobs.filter((j) => j.days.includes(dayIndex));
            const isToday = new Date().getDay() === dayIndex;

            return (
              <div
                key={day}
                className={`bg-[#16213e] rounded-lg border ${
                  isToday ? "border-[#8b5cf6]/50 ring-1 ring-[#8b5cf6]/20" : "border-[#2d3748]"
                } overflow-hidden`}
              >
                <div
                  className={`px-3 py-2 text-center border-b ${
                    isToday
                      ? "bg-[#8b5cf6]/20 border-[#8b5cf6]/30"
                      : "bg-[#1a1a2e] border-[#2d3748]"
                  }`}
                >
                  <p className={`text-sm font-semibold ${isToday ? "text-[#8b5cf6]" : "text-white"}`}>
                    {day}
                  </p>
                  <p className="text-xs text-[#94a3b8]">{DAY_NAMES_HEB[dayIndex]}</p>
                </div>
                <div className="p-2 space-y-1.5 min-h-[200px]">
                  {dayJobs.length === 0 ? (
                    <p className="text-xs text-[#4a5568] text-center py-4">No jobs</p>
                  ) : (
                    dayJobs.map((job, i) => (
                      <div
                        key={i}
                        className={`${job.color} border rounded-md px-2 py-1.5 text-xs ${
                          !job.enabled ? "opacity-40" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{job.icon}</span>
                          <span className="font-mono font-bold">{job.time}</span>
                        </div>
                        <p className="mt-0.5 font-medium truncate">{job.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Jobs List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">All Cron Jobs ({jobs.length})</h2>
        <div className="bg-[#16213e] rounded-lg border border-[#2d3748] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a2e] text-[#94a3b8]">
                <th className="text-left px-4 py-2">Job</th>
                <th className="text-left px-4 py-2">Time</th>
                <th className="text-left px-4 py-2">Days</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr key={i} className="border-t border-[#2d3748] hover:bg-[#1a2745]">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span>{job.icon}</span>
                    <span className="text-white">{job.name}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-[#94a3b8]">{job.time}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      {DAY_NAMES.map((d, di) => (
                        <span
                          key={d}
                          className={`text-[10px] w-5 h-5 rounded flex items-center justify-center ${
                            job.days.includes(di)
                              ? "bg-[#8b5cf6]/30 text-[#8b5cf6]"
                              : "text-[#4a5568]"
                          }`}
                        >
                          {d[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        job.enabled
                          ? "bg-[#10b981]/20 text-[#10b981]"
                          : "bg-[#ef4444]/20 text-[#ef4444]"
                      }`}
                    >
                      {job.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
