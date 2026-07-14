import React, { useState, useEffect, useRef } from "react";
import { Search, Moon, Sun, Laptop, Menu, X, Landmark, HeartPulse, GraduationCap, Ruler, Calculator, Home, Briefcase, ShieldAlert, ShieldCheck, TrendingUp, FileText, Clock, Car, Sparkles } from "lucide-react";
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
};

export default function Header({ toolsUrl }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
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

  // Set initial theme from document element
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Handle outside clicks for search dropdown
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

  const filteredTools = query.trim() === "" 
    ? [] 
    : tools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.shortDesc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Tool<span className="text-primary">Hub</span>
            </span>
          </a>
        </div>

        {/* Desktop Search Bar */}
        <div className="relative hidden max-w-md flex-1 px-8 md:block" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search 60+ free calculators..."
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
              className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm text-foreground ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && toolsLoading && (
            <div className="absolute top-full left-8 right-8 mt-2 rounded-md border border-border bg-card p-4 text-center text-sm text-muted shadow-lg">
              Loading tools...
            </div>
          )}
          {showSearchDropdown && filteredTools.length > 0 && (
            <div className="absolute top-full left-8 right-8 mt-2 max-h-[300px] overflow-y-auto rounded-md border border-border bg-card shadow-lg">
              <ul className="p-2">
                {filteredTools.map((tool) => {
                  const Icon = categoryIcons[tool.categorySlug] || Calculator;
                  return (
                    <li key={tool.slug}>
                      <a
                        href={`/${tool.categorySlug}/${tool.slug}/`}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                        onClick={() => {
                          setQuery("");
                          setShowSearchDropdown(false);
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted" />
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-xs text-muted truncate max-w-[280px]">{tool.shortDesc}</p>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {showSearchDropdown && query.trim() !== "" && filteredTools.length === 0 && (
            <div className="absolute top-full left-8 right-8 mt-2 rounded-md border border-border bg-card p-4 text-center text-sm text-muted shadow-lg">
              No tools found matching "{query}"
            </div>
          )}
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                void ensureToolsLoaded();
              }}
              onFocus={() => void ensureToolsLoaded()}
              className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {toolsLoading && query.trim() !== "" && (
              <div className="mt-2 rounded-md border border-border bg-card p-3 text-center text-xs text-muted shadow-lg">
                Loading tools...
              </div>
            )}
            {query.trim() !== "" && filteredTools.length > 0 && (
              <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md border border-border bg-card">
                <ul className="p-2">
                  {filteredTools.map((tool) => {
                    const Icon = categoryIcons[tool.categorySlug] || Calculator;
                    return (
                      <li key={tool.slug}>
                        <a
                          href={`/${tool.categorySlug}/${tool.slug}/`}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => {
                            setQuery("");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted" />
                          <span>{tool.name}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {query.trim() !== "" && !toolsLoading && toolsLoaded && filteredTools.length === 0 && (
              <div className="mt-2 rounded-md border border-border bg-card p-3 text-center text-xs text-muted shadow-lg">
                No results found
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-2">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Home
            </a>
            <a
              href="/about/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              About Us
            </a>
            <a
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Contact
            </a>
            <a
              href="/admin/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-secondary"
            >
              Admin Panel
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
