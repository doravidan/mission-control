"use client";

import { useEffect, useState, useCallback } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  list: string;
}

export default function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [tasksFile, setTasksFile] = useState<string | null>(null);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/tasks/file").then((r) => r.json()).catch(() => ({ content: null })),
    ])
      .then(([taskData, fileData]) => {
        setTasks(taskData.tasks || []);
        setTasksFile(fileData.content || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchTasks();
    } finally {
      setCompleting(null);
    }
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94a3b8]">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-white">{pendingTasks.length}</p>
          <p className="text-sm text-[#94a3b8]">Pending</p>
        </div>
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-[#10b981]">{completedTasks.length}</p>
          <p className="text-sm text-[#94a3b8]">Completed</p>
        </div>
        <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-4">
          <p className="text-3xl font-bold text-[#8b5cf6]">{tasks.length}</p>
          <p className="text-sm text-[#94a3b8]">Total</p>
        </div>
      </div>

      {/* Pending Tasks */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          📋 Pending Tasks
        </h2>
        <div className="space-y-2">
          {pendingTasks.length === 0 ? (
            <div className="bg-[#16213e] border border-[#2d3748] rounded-lg px-5 py-8 text-center text-[#94a3b8]">
              All tasks completed! 🎉
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#16213e] border border-[#2d3748] rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-[#1a2745] transition-colors group"
              >
                <button
                  onClick={() => handleComplete(task.id)}
                  disabled={completing === task.id}
                  className={`w-5 h-5 rounded border-2 border-[#8b5cf6] flex items-center justify-center transition-colors ${
                    completing === task.id
                      ? "bg-[#8b5cf6]/50"
                      : "hover:bg-[#8b5cf6]/30 group-hover:border-[#8b5cf6]"
                  }`}
                >
                  {completing === task.id && (
                    <span className="text-xs text-white">⏳</span>
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm text-white">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-[#f59e0b]">Due: {task.dueDate}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#94a3b8] mb-3 flex items-center gap-2">
            ✅ Completed
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#16213e]/50 border border-[#2d3748]/50 rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded bg-[#10b981]/30 flex items-center justify-center text-[#10b981] text-xs">
                  ✓
                </div>
                <p className="text-sm text-[#94a3b8] line-through">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TASKS.md */}
      {tasksFile && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            📝 TASKS.md
          </h2>
          <div className="bg-[#16213e] border border-[#2d3748] rounded-lg p-5">
            <pre className="text-sm text-[#94a3b8] whitespace-pre-wrap font-mono">
              {tasksFile}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
