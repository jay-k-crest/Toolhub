import React, { useState, useEffect, useRef } from "react";
import { Search, Calculator, ArrowRight } from "lucide-react";
import { loadSearchTools, type SearchToolItem } from "../../lib/search-tools";

interface HomepageSearchProps {
  toolsUrl: string;
}

export default function HomepageSearch({ toolsUrl }: HomepageSearchProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [tools, setTools] = useState<SearchToolItem[]>([]);
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const [toolsLoading, setToolsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ensureToolsLoaded = async () => {
    if (toolsLoaded || toolsLoading) {
      return;
    }

    setToolsLoading(true);
    try {
      const loadedTools = await loadSearchTools(toolsUrl);
      setTools(loadedTools);
      setToolsLoaded(true);
    } catch (error) {
      console.warn("Unable to load search tools:", error);
    } finally {
      setToolsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim() === ""
    ? []
    : tools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search 60+ free tools (e.g. EMI, BMI, GPA, Percentage)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            void ensureToolsLoaded();
          }}
          onFocus={() => {
            setShowDropdown(true);
            void ensureToolsLoaded();
          }}
          className="h-12 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {showDropdown && toolsLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-lg border border-border bg-card p-4 text-center text-sm text-muted shadow-lg">
          Loading tools...
        </div>
      )}

      {showDropdown && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-[300px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          <ul className="p-2">
            {filtered.map((tool) => (
              <li key={tool.slug}>
                <a
                  href={`/${tool.categorySlug}/${tool.slug}/`}
                  className="flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">{tool.name}</p>
                      <p className="text-xs text-muted truncate max-w-[280px] sm:max-w-[400px]">{tool.shortDesc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDropdown && query.trim() !== "" && !toolsLoading && toolsLoaded && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-lg border border-border bg-card p-4 text-center text-sm text-muted shadow-lg">
          No tools found matching "{query}"
        </div>
      )}
    </div>
  );
}
