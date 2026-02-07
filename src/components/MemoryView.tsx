"use client";

import { useEffect, useState } from "react";

interface MemoryFile {
  name: string;
  path: string;
  size: number;
  modified: string;
}

export default function MemoryView() {
  const [memoryMd, setMemoryMd] = useState("");
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ file: string; matches: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/memory").then((r) => r.json()),
      fetch("/api/memory/files").then((r) => r.json()),
    ])
      .then(([memData, filesData]) => {
        setMemoryMd(memData.content || "");
        setFiles(filesData.files || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadFile = async (name: string) => {
    setSelectedFile(name);
    const res = await fetch(`/api/memory/files/${encodeURIComponent(name)}`);
    const data = await res.json();
    setFileContent(data.content || "");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const res = await fetch(`/api/memory/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setSearchResults(data.results || []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94a3b8]">Loading memory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search memory files..."
          className="flex-1 bg-[#16213e] border border-[#2d3748] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-[#8b5cf6]/50"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-lg text-white text-sm font-medium"
        >
          🔍 Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-[#16213e] border border-[#8b5cf6]/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#8b5cf6] mb-3">
            Search Results ({searchResults.length} files)
          </h3>
          {searchResults.map((result, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <button
                onClick={() => loadFile(result.file)}
                className="text-sm font-medium text-[#3b82f6] hover:underline"
              >
                {result.file}
              </button>
              {result.matches.map((match, j) => (
                <p key={j} className="text-xs text-[#94a3b8] mt-1 pl-4 border-l border-[#2d3748]">
                  ...{match}...
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* MEMORY.md */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            🧠 {selectedFile ? selectedFile : "MEMORY.md"}
          </h2>
          <div className="bg-[#16213e] border border-[#2d3748] rounded-lg p-5 max-h-[600px] overflow-auto">
            <pre className="text-sm text-[#94a3b8] whitespace-pre-wrap font-mono leading-relaxed">
              {selectedFile ? fileContent : memoryMd}
            </pre>
          </div>
          {selectedFile && (
            <button
              onClick={() => setSelectedFile(null)}
              className="mt-2 text-sm text-[#8b5cf6] hover:underline"
            >
              ← Back to MEMORY.md
            </button>
          )}
        </div>

        {/* File list */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            📁 Memory Files
          </h2>
          <div className="bg-[#16213e] border border-[#2d3748] rounded-lg divide-y divide-[#2d3748]">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => loadFile(file.name)}
                className={`w-full text-left px-4 py-3 hover:bg-[#1a2745] transition-colors ${
                  selectedFile === file.name ? "bg-[#8b5cf6]/10" : ""
                }`}
              >
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-[#4a5568]">{file.modified}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
