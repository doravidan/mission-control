"use client";

import { useEffect, useState } from "react";

interface Project {
  name: string;
  path: string;
  description: string;
  branch: string;
  lastCommit: string;
  lastCommitDate: string;
  dirty: boolean;
  exists: boolean;
}

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94a3b8]">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-white">{projects.length}</p>
          <p className="text-sm text-[#94a3b8]">Total Projects</p>
        </div>
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-[#f59e0b]">
            {projects.filter((p) => p.dirty).length}
          </p>
          <p className="text-sm text-[#94a3b8]">Uncommitted Changes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className={`bg-[#16213e] border rounded-lg px-5 py-4 ${
              project.dirty
                ? "border-[#f59e0b]/40"
                : "border-[#2d3748]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  📊 {project.name}
                  {project.dirty && (
                    <span className="text-[10px] bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 rounded-full">
                      modified
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#4a5568] mt-0.5">{project.path}</p>
              </div>
              {!project.exists && (
                <span className="text-xs text-[#ef4444]">Not Found</span>
              )}
            </div>
            {project.description && (
              <p className="text-xs text-[#94a3b8] mt-2">{project.description}</p>
            )}
            {project.exists && (
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8b5cf6]">⎇</span>
                  <span className="text-[#94a3b8] font-mono">{project.branch}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-[#3b82f6]">●</span>
                  <span className="text-[#94a3b8] truncate">{project.lastCommit}</span>
                </div>
                <span className="text-[#4a5568] flex-shrink-0">{project.lastCommitDate}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
