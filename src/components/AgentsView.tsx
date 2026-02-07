"use client";

import { useEffect, useState, useCallback } from "react";

interface Agent {
  sessionId: string;
  label: string;
  status: string;
  startedAt: string;
  runtime: string;
  model?: string;
}

export default function AgentsView() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94a3b8]">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-white">{agents.length}</p>
          <p className="text-sm text-[#94a3b8]">Active Agents</p>
        </div>
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-[#10b981]">
            {agents.filter((a) => a.status === "running").length}
          </p>
          <p className="text-sm text-[#94a3b8]">Running</p>
        </div>
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-[#8b5cf6]">🏃</p>
            <p className="text-sm text-[#94a3b8]">Sub-Agents</p>
          </div>
          <button
            onClick={fetchAgents}
            className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Agent List */}
      {agents.length === 0 ? (
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-12 text-center">
          <p className="text-4xl mb-3">😴</p>
          <p className="text-[#94a3b8]">No active sub-agents</p>
          <p className="text-[#4a5568] text-sm mt-1">
            Sub-agents will appear here when Eden spawns them for tasks
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.sessionId}
              className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4 hover:bg-[#1a2745] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      agent.status === "running"
                        ? "bg-[#10b981] animate-pulse-glow"
                        : "bg-[#f59e0b]"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {agent.label || agent.sessionId}
                    </p>
                    <p className="text-xs text-[#94a3b8]">{agent.sessionId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#94a3b8]">{agent.runtime}</p>
                  {agent.model && (
                    <p className="text-xs text-[#4a5568]">{agent.model}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
