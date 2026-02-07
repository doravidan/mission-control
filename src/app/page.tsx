"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ChatView from "@/components/ChatView";
import MemoryView from "@/components/MemoryView";
import AgentsView from "@/components/AgentsView";
import ProjectsView from "@/components/ProjectsView";

const tabs = [
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "memory", label: "Memory", icon: "🧠" },
  { id: "agents", label: "Live Agents", icon: "🏃" },
  { id: "projects", label: "Projects", icon: "📊" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("calendar");

  const renderContent = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "tasks":
        return <TasksView />;
      case "chat":
        return <ChatView />;
      case "memory":
        return <MemoryView />;
      case "agents":
        return <AgentsView />;
      case "projects":
        return <ProjectsView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-[#2d3748] bg-[#0f0f1a]/80 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <h1 className="text-xl font-bold text-white">Mission Control</h1>
              <span className="text-sm text-[#94a3b8] ml-2">Eden&apos;s Command Center</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#10b981]">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-glow"></span>
                Online
              </div>
            </div>
          </div>
        </header>
        <div className="p-6 animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
