"use client";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0d0d1a] border-r border-[#2d3748] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2d3748]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">Eden</h2>
            <p className="text-xs text-[#94a3b8]">Mission Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30"
                : "text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-white"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#2d3748]">
        <div className="text-xs text-[#4a5568]">
          <p>Gateway: localhost:18789</p>
          <p>Agent: eden</p>
        </div>
      </div>
    </aside>
  );
}
