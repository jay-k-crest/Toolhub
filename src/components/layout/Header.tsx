import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Landmark,
  HeartPulse,
  GraduationCap,
  Ruler,
  Calculator,
  Home,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  Car,
  Sparkles,
  Terminal,
  ChevronRight,
  Command,
} from "lucide-react";
import { loadSearchTools, type SearchToolItem } from "../../lib/search-tools";

interface HeaderProps {
  toolsUrl: string;
}

const categoryIcons: Record<string, any> = {
  finance: Landmark,
  health: HeartPulse,
  education: GraduationCap,
  converters: Ruler,
  math: Calculator,
  "real-estate": Home,
  business: Briefcase,
  insurance: ShieldCheck,
  "crypto-stocks": TrendingUp,
  "seo-text": FileText,
  "date-time": Clock,
  automobile: Car,
  astrology: Sparkles,
  "developer-ai": Terminal,
};

export default function Header({ toolsUrl }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [tools, setTools] = useState<SearchToolItem[]>([]);
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const [toolsLoading, setToolsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Global hotkey Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
        void ensureToolsLoaded();
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
        void ensureToolsLoaded();
      } else if (e.key === "Escape") {
        setShowSearchDropdown(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.classList.contains("dark") ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    if (nextTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const filteredTools =
    query.trim() === ""
      ? []
      : tools
          .filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              t.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
              t.categorySlug.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 10);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Calculator className="h-4 w-4" />
            </div>
            <span className="font-heading text-xl font-black tracking-tight text-foreground">
              Tool<span className="text-primary">Hub</span>
            </span>
          </a>

          {/* Quick Categories Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-muted">
            <a href="/finance/" className="hover:text-foreground transition-colors">Finance</a>
            <a href="/health/" className="hover:text-foreground transition-colors">Health</a>
            <a href="/converters/" className="hover:text-foreground transition-colors">Converters</a>
            <a href="/developer-ai/" className="hover:text-foreground transition-colors text-primary flex items-center gap-1">
              <Terminal className="h-3 w-3" /> Dev & AI
            </a>
          </nav>
        </div>

        {/* Desktop Search Bar */}
        <div className="relative hidden max-w-md flex-1 px-6 md:block" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 100+ free tools..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSearchDropdown(true);
                void ensureToolsLoaded();
              }}
              onFocus={() => {
                setShowSearchDropdown(true);
                void ensureToolsLoaded();
              }}
              className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-14 text-xs text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-xs"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-muted bg-secondary/80 px-1.5 py-0.5 rounded border border-border/80 pointer-events-none">
              <span>⌘K</span>
            </div>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-6 right-6 mt-2 max-h-[380px] overflow-y-auto rounded-xl border border-border bg-card shadow-xl p-2 z-50">
              {toolsLoading && (
                <div className="p-4 text-center text-xs text-muted">
                  Searching index...
                </div>
              )}

              {filteredTools.length > 0 && (
                <ul className="space-y-1">
                  {filteredTools.map((tool) => {
                    const Icon = categoryIcons[tool.categorySlug] || Calculator;
                    return (
                      <li key={tool.slug}>
                        <a
                          href={`/${tool.categorySlug}/${tool.slug}/`}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary transition-colors group text-left"
                          onClick={() => {
                            setQuery("");
                            setShowSearchDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-md bg-secondary/60 text-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                                {tool.name}
                              </p>
                              <p className="text-[11px] text-muted truncate max-w-[260px]">
                                {tool.shortDesc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {query.trim() !== "" && !toolsLoading && filteredTools.length === 0 && (
                <div className="p-4 text-center text-xs text-muted">
                  No tools found matching &ldquo;{query}&rdquo;
                </div>
              )}

              {query.trim() === "" && (
                <div className="p-3 text-[11px] text-muted space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-foreground block">
                    Quick Suggestions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["ai-chat-to-json", "emi-calculator", "sip-calculator", "unit-converter", "json-formatter", "password-generator"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setQuery(s.replace(/-/g, " "));
                          void ensureToolsLoaded();
                        }}
                        className="px-2 py-1 bg-secondary rounded text-[10px] font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {s.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Nav Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary cursor-pointer shadow-xs"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary md:hidden cursor-pointer shadow-xs"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search all calculators & tools..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                void ensureToolsLoaded();
              }}
              onFocus={() => void ensureToolsLoaded()}
              className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {query.trim() !== "" && filteredTools.length > 0 && (
              <div className="mt-2 max-h-[220px] overflow-y-auto rounded-lg border border-border bg-card p-1">
                {filteredTools.map((tool) => (
                  <a
                    key={tool.slug}
                    href={`/${tool.categorySlug}/${tool.slug}/`}
                    className="flex items-center gap-2 p-2 rounded text-xs text-foreground hover:bg-secondary"
                    onClick={() => {
                      setQuery("");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="font-semibold">{tool.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <a href="/finance/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary">Finance & Loans</a>
            <a href="/developer-ai/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-primary font-bold">Dev & AI Suite</a>
            <a href="/health/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary">Health & Fitness</a>
            <a href="/converters/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary">Converters</a>
            <a href="/math/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary">Math & Utility</a>
            <a href="/seo-text/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary">Text & SEO</a>
            <a href="/about/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-card border border-border">About Us</a>
            <a href="/contact/" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-card border border-border">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
