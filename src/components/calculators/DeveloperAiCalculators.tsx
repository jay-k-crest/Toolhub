import React, { useState, useEffect, useRef } from "react";
import { generateJWTSecret } from "../../lib/calculators/math-calculators";
import {
  parseAIChatUniversal,
  exportToJSON,
  exportToMarkdown,
  exportToPDF,
  exportToPlainText,
  exportToCSV,
  exportToHTML,
  getChatStats,
  type ChatMessage,
} from "../../lib/calculators/ai-chat-exporter";
import {
  processJson,
  encodeBase64,
  decodeBase64,
  generateHashes,
  parseAndConvertUrl,
  markdownToHtml,
  convertColor,
} from "../../lib/calculators/developer-tools";
import {
  Download,
  Copy,
  Check,
  FileJson,
  FileText,
  FileCode,
  Sparkles,
  Search,
  Trash2,
  Upload,
  RefreshCw,
  Eye,
  Shield,
  Key,
  Hash,
  Terminal,
  Layers,
  ArrowRightLeft,
  AlertCircle,
  FileUp,
  ClipboardPaste,
  ExternalLink,
  Table,
} from "lucide-react";

interface DeveloperAiProps {
  slug: string;
}

export default function DeveloperAiCalculators({ slug }: DeveloperAiProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Copied indicator state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ========================================================
  // 1. AI CHAT EXPORTER STATES
  // ========================================================
  const [chatRawContent, setChatRawContent] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [chatTitle, setChatTitle] = useState("Exported AI Conversation");
  const [parsedChatMessages, setParsedChatMessages] = useState<ChatMessage[]>([]);
  const [detectedFormat, setDetectedFormat] = useState("");
  const [parseError, setParseError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [chatSearchFilter, setChatSearchFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "assistant">("all");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDemoChat = `User: Explain quantum computing in 2 simple sentences.
Assistant: Quantum computing uses quantum bits, or qubits, which can exist in multiple superposition states simultaneously rather than just traditional 0s and 1s. This enables quantum machines to perform complex calculations in minutes that would take classical supercomputers thousands of years.
User: What are 3 practical real-world applications?
Assistant: 1. **Drug Discovery & Molecular Modeling**: Simulating biological molecular interactions to accelerate life-saving medicine formulation.
2. **Post-Quantum Cryptography**: Designing encryption algorithms resistant to quantum cryptanalysis and mathematical factorizations.
3. **Logistics & Route Optimization**: Solving combinatorial multi-variable routing problems across global supply chains.
User: How soon until commercial quantum advantage?
Assistant: Specialized quantum supremacy in materials science and optimization is expected between 2027 and 2030 as fault-tolerant logical qubits scale above 1,000 physical units.`;

  // Fetch URL with multi-layered proxy fallback
  const fetchUrlContent = async (targetUrl: string): Promise<string> => {
    // 1. Try local server API endpoint
    try {
      const localRes = await fetch(`/api/fetch-chat?url=${encodeURIComponent(targetUrl)}`);
      if (localRes.ok) {
        const data = await localRes.json();
        if (data.content && data.content.length > 50) {
          return data.content;
        }
      }
    } catch {
      // Continue to next fallback
    }

    // 2. Try corsproxy.io
    try {
      const proxyRes = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`);
      if (proxyRes.ok) {
        const text = await proxyRes.text();
        if (text && text.length > 50) return text;
      }
    } catch {
      // Continue to next fallback
    }

    // 3. Try codetabs proxy
    try {
      const codetabsRes = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
      if (codetabsRes.ok) {
        const text = await codetabsRes.text();
        if (text && text.length > 50) return text;
      }
    } catch {
      // Continue to next fallback
    }

    // 4. Try allorigins.win
    try {
      const alloriginsRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      if (alloriginsRes.ok) {
        const data = await alloriginsRes.json();
        if (data.contents && data.contents.length > 50) return data.contents;
      }
    } catch {
      // All proxies failed
    }

    throw new Error("CORS_BLOCK");
  };

  const handleParseChat = async (overrideContent?: string) => {
    setParseError("");
    setIsParsing(true);

    let contentToParse = (overrideContent ?? chatRawContent).trim();
    const isFromUrl = !contentToParse && Boolean(chatLink.trim());

    if (isFromUrl) {
      setIsFetchingLink(true);
      try {
        contentToParse = await fetchUrlContent(chatLink.trim());
      } catch (err: any) {
        setParseError(
          "Could not directly fetch the chat from this link (the provider may require browser rendering or session cookies). Please open the link, select all text (Ctrl+A -> Ctrl+C), and click 'Paste Clipboard'."
        );
        setIsParsing(false);
        setIsFetchingLink(false);
        return;
      } finally {
        setIsFetchingLink(false);
      }
    }

    if (!contentToParse) {
      setParseError("Please paste your chat transcript, enter a shared link, or upload an exported chat file (.json, .txt, .md).");
      setIsParsing(false);
      return;
    }

    try {
      const parsed = parseAIChatUniversal(contentToParse);
      if (parsed.messages.length === 0) {
        if (isFromUrl) {
          setParseError(
            "The link was reached, but the conversation text is rendered client-side by your browser. Please open the link, select all text (Ctrl+A -> Ctrl+C), and click 'Paste Clipboard'."
          );
        } else {
          setParseError(
            "Could not detect dialogue messages from the provided input. Please paste your chat transcript, markdown dialogue, or JSON file."
          );
        }
      } else {
        setParsedChatMessages(parsed.messages);
        setDetectedFormat(parsed.detectedFormat);
        if (parsed.title && parsed.title !== "Shared Chat" && parsed.title !== "Exported AI Conversation" && parsed.title !== "Untitled Conversation") {
          setChatTitle(parsed.title);
        }
      }
    } catch (err: any) {
      setParseError(`Parsing error: ${err.message || "Invalid format"}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || text.trim() === "") {
        setParseError("Clipboard is empty. Please copy your AI conversation text first.");
        return;
      }
      setChatRawContent(text);
      setParseError("");
      handleParseChat(text);
    } catch (e) {
      setParseError("Clipboard access blocked by browser. Please manually paste with Ctrl+V into the text area below.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setChatRawContent(content);
      setChatTitle(file.name.replace(/\.[^/.]+$/, ""));
      handleParseChat(content);
    };
    reader.readAsText(file);
  };

  const deleteMessage = (id: string) => {
    setParsedChatMessages(parsedChatMessages.filter((m) => m.id !== id));
  };

  const toggleMessageRole = (id: string) => {
    setParsedChatMessages(
      parsedChatMessages.map((m) =>
        m.id === id ? { ...m, role: m.role === "user" ? "assistant" : "user" } : m
      )
    );
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (parsedChatMessages.length === 0) return;
    try {
      setPdfGenerating(true);
      await exportToPDF(parsedChatMessages, chatTitle);
    } catch (err) {
      alert("Failed to render PDF. Please try downloading as Markdown or JSON.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const chatStats = getChatStats(parsedChatMessages, chatTitle);
  const filteredChatMessages = parsedChatMessages.filter((m) => {
    const matchesSearch = chatSearchFilter === "" || m.text.toLowerCase().includes(chatSearchFilter.toLowerCase());
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ========================================================
  // 2. JWT SECRET GENERATOR STATES
  // ========================================================
  const [jwtBits, setJwtBits] = useState<256 | 384 | 512>(256);
  const [jwtEncoding, setJwtEncoding] = useState<"base64" | "base64url" | "hex" | "plain">("base64");
  const [jwtResult, setJwtResult] = useState(() => generateJWTSecret(256, "base64"));

  // ========================================================
  // 3. JSON FORMATTER & VALIDATOR STATES
  // ========================================================
  const [jsonInput, setJsonInput] = useState(`{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "user": {\n      "id": 1042,\n      "name": "Alex Smith",\n      "roles": ["admin", "developer"],\n      "verified": true\n    }\n  }\n}`);
  const [jsonIndent, setJsonIndent] = useState<number>(2);
  const jsonProcessed = processJson(jsonInput, jsonIndent);

  // ========================================================
  // 4. BASE64 ENCODER / DECODER STATES
  // ========================================================
  const [b64Text, setB64Text] = useState("ToolHub Developer Suite 2026 🚀");
  const [b64Encoded, setB64Encoded] = useState(() => encodeBase64("ToolHub Developer Suite 2026 🚀"));
  const [b64UrlSafe, setB64UrlSafe] = useState(false);
  const [b64Mode, setB64Mode] = useState<"encode" | "decode">("encode");

  // ========================================================
  // 5. HASH & CHECKSUM STATES
  // ========================================================
  const [hashInput, setHashInput] = useState("The quick brown fox jumps over the lazy dog");
  const [hmacSecret, setHmacSecret] = useState("");
  const [hashResults, setHashResults] = useState<{
    sha256: string;
    sha512: string;
    sha1: string;
    sha384: string;
    md5: string;
  }>({ sha256: "", sha512: "", sha1: "", sha384: "", md5: "" });

  useEffect(() => {
    generateHashes(hashInput, hmacSecret).then(setHashResults);
  }, [hashInput, hmacSecret]);

  // ========================================================
  // 6. MARKDOWN PREVIEWER STATES
  // ========================================================
  const [mdInput, setMdInput] = useState(`# Welcome to ToolHub Markdown
## Powerful Client-Side Utilities

ToolHub allows you to **edit**, **convert**, and export documents without tracking.

### Key Features
- Instant live preview
- Clean code block styling
- Export to HTML or download Markdown

\`\`\`typescript
const greeting = "Hello, Developer!";
console.log(greeting);
\`\`\`

> Built with precision, zero trackers, and client-side processing.`);

  const devAiTools = [
    { slug: "ai-chat-to-json", label: "AI Chat Exporter (PDF/MD/JSON)", icon: FileJson },
    { slug: "jwt-secret-generator", label: "JWT Secret Generator", icon: Key },
    { slug: "json-formatter", label: "JSON Formatter & Validator", icon: FileCode },
    { slug: "base64-encoder-decoder", label: "Base64 Encoder / Decoder", icon: ArrowRightLeft },
    { slug: "hash-generator", label: "Hash & Checksum Generator", icon: Hash },
    { slug: "markdown-previewer", label: "Markdown Live Converter", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {devAiTools.map((t) => {
          const Icon = t.icon;
          const isActive = activeSlug === t.slug;
          return (
            <a
              key={t.slug}
              href={`/developer-ai/${t.slug}/`}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </a>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TOOL 1: AI CHAT MULTI-FORMAT EXPORTER */}
      {/* ========================================================================= */}
      {activeSlug === "ai-chat-to-json" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Column */}
            <div className="lg:col-span-6 space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-primary" />
                  Import AI Conversation
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePasteFromClipboard}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="h-3.5 w-3.5" /> Paste Clipboard
                  </button>
                  <button
                    onClick={() => {
                      setChatRawContent(sampleDemoChat);
                      setChatTitle("Quantum Computing Architecture");
                      handleParseChat(sampleDemoChat);
                    }}
                    className="text-xs text-muted hover:text-foreground font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" /> Load Sample
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label htmlFor="chat-title-input" className="text-xs font-medium text-foreground">
                  Conversation Document Title
                </label>
                <input
                  id="chat-title-input"
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder="e.g., System Architecture & Strategy"
                  className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Public URL Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="chat-url-input" className="text-xs font-medium text-foreground">
                    Public Shared Chat Link (ChatGPT / Claude / Gemini / DeepSeek)
                  </label>
                  {chatLink.trim().startsWith("http") && (
                    <a
                      href={chatLink.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="h-3 w-3" /> Open in New Tab
                    </a>
                  )}
                </div>
                <input
                  id="chat-url-input"
                  type="text"
                  value={chatLink}
                  onChange={(e) => {
                    setChatLink(e.target.value);
                    if (parseError) setParseError("");
                  }}
                  placeholder="https://chatgpt.com/share/... or https://claude.ai/share/..."
                  className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />

                {/* Helper notice for Claude and ChatGPT client-rendered links */}
                {chatLink.trim().length > 10 && (chatLink.includes("claude.ai") || chatLink.includes("chatgpt.com")) && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs space-y-2">
                    <p className="text-foreground font-medium">
                      💡 <strong>Quick Export Tip for Claude & ChatGPT links:</strong>
                    </p>
                    <p className="text-muted leading-relaxed">
                      Claude and ChatGPT render conversation text in the browser. To import this chat instantly:
                      open your link, select all (<kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">Ctrl+A</kbd> / <kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">Cmd+A</kbd>), copy (<kbd className="px-1 py-0.5 bg-secondary border border-border rounded text-[10px]">Ctrl+C</kbd>), and click below.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handlePasteFromClipboard}
                        className="py-1.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ClipboardPaste className="h-3.5 w-3.5" /> 1-Click Paste Clipboard
                      </button>
                      <a
                        href={chatLink.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open Chat Page
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Raw Content Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="chat-raw-input" className="text-xs font-medium text-foreground">
                    Paste Chat Text / Transcript / JSON / Markdown
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="h-3 w-3" /> Upload File (.json, .txt, .md, .html)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.txt,.md,.html"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <textarea
                  id="chat-raw-input"
                  value={chatRawContent}
                  onChange={(e) => setChatRawContent(e.target.value)}
                  rows={8}
                  placeholder={`Paste conversation dialogue here:
- ChatGPT / Claude / Gemini / DeepSeek plain text transcripts
- OpenAI conversations.json or Claude data export files
- Markdown format (User: ... / Assistant: ...)
- Web HTML content`}
                  className="w-full rounded-lg border border-input bg-secondary/30 px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
                />
              </div>

              {/* Bookmarklet Quick-Export Guide */}
              <div className="p-3 bg-secondary/40 border border-border rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Browser Bookmarklet (Instant Export)
                  </span>
                  <button
                    onClick={() => {
                      const code = `javascript:(function(){try{let title=document.title.replace(/[-|]\\s*(ChatGPT|Claude|Gemini).*$/i,'').trim()||'AI Conversation';let text='';let articles=document.querySelectorAll('article,[data-testid^="conversation-turn"]');if(articles.length>0){articles.forEach((art)=>{let isUser=art.querySelector('[data-message-author-role="user"]')||art.textContent.includes('You said:');let role=isUser?'User':'Assistant';let body=art.querySelector('.markdown,.whitespace-pre-wrap,[class*="text-message"]')||art;text+='\\n\\n### '+role+'\\n'+(body.innerText||body.textContent).trim()+'\\n';});}else{let turns=document.querySelectorAll('.font-claude-message,[class*="font-claude"],[data-testid*="conversation-turn"],.prose');if(turns.length>0){turns.forEach((t,i)=>{let role=i%2===0?'User':'Assistant';text+='\\n\\n### '+role+'\\n'+(t.innerText||t.textContent).trim()+'\\n';});}else{text=window.getSelection().toString()||document.body.innerText;}}if(navigator.clipboard){navigator.clipboard.writeText(text.trim()).then(()=>{alert('Chat copied! Switch to ToolHub and click Paste Clipboard.');});}else{alert('Copied');}}catch(e){alert(e.message);}})();`;
                      navigator.clipboard.writeText(code);
                      alert("Bookmarklet code copied to clipboard! Create a browser bookmark and paste this code as the URL.");
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy Bookmarklet Code
                  </button>
                </div>
                <p className="text-muted text-[11px] leading-relaxed">
                  How it works: Open-source AI exporters run directly in your active chat tab where your browser has access to the conversation. Click the bookmarklet on any ChatGPT or Claude page to instantly copy the formatted chat.
                </p>
              </div>

              {parseError && (
                <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-medium space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{parseError}</span>
                  </div>
                  <div className="pl-6 pt-1 flex flex-wrap gap-2">
                    <button
                      onClick={handlePasteFromClipboard}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ClipboardPaste className="h-3.5 w-3.5" /> 1-Click Paste from Clipboard
                    </button>
                    {chatLink.trim().startsWith("http") && (
                      <a
                        href={chatLink.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open Chat Page
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleParseChat()}
                disabled={isParsing}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {isFetchingLink ? "Fetching from Shared Link..." : "Parsing Conversation..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Parse & Prepare Downloads
                  </>
                )}
              </button>
            </div>

            {/* Results & Multi-Format Exporters */}
            <div className="lg:col-span-6 space-y-4">
              {/* Stats Banner */}
              {parsedChatMessages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card border border-border p-3.5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block">Messages</span>
                    <span className="text-xl font-heading font-extrabold text-foreground tabular-nums">
                      {chatStats.totalMessages}
                    </span>
                  </div>
                  <div className="bg-card border border-border p-3.5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block">Word Count</span>
                    <span className="text-xl font-heading font-extrabold text-primary tabular-nums">
                      {chatStats.totalWords.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-card border border-border p-3.5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block">Est. Tokens</span>
                    <span className="text-xl font-heading font-extrabold text-emerald-600 tabular-nums">
                      ~{chatStats.estimatedTokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* DOWNLOAD & EXPORT PANEL */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Export & Download Options
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      Download conversation as PDF, Markdown, JSON, CSV, or Text.
                    </p>
                  </div>
                  {parsedChatMessages.length > 0 && (
                    <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                      {detectedFormat || "Parsed"}
                    </span>
                  )}
                </div>

                {parsedChatMessages.length === 0 ? (
                  <div className="py-8 text-center text-muted text-xs space-y-2">
                    <Download className="h-8 w-8 mx-auto text-muted/50" />
                    <p className="font-medium text-foreground">No conversation imported yet</p>
                    <p>Paste your chat text or load a sample on the left to activate instant downloads.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Primary Download Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Markdown Download */}
                      <button
                        onClick={() =>
                          downloadFile(
                            exportToMarkdown(parsedChatMessages, chatTitle),
                            `${chatTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.md`,
                            "text/markdown"
                          )
                        }
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-border bg-secondary/40 hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all cursor-pointer shadow-xs group"
                      >
                        <FileText className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                        <span>Download Markdown</span>
                        <span className="text-[10px] opacity-75 font-normal">.md format</span>
                      </button>

                      {/* PDF Download */}
                      <button
                        onClick={handleDownloadPDF}
                        disabled={pdfGenerating}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-600 text-xs font-bold transition-all cursor-pointer shadow-xs group"
                      >
                        {pdfGenerating ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5 group-hover:text-white" />
                        )}
                        <span>Download PDF</span>
                        <span className="text-[10px] opacity-75 font-normal">Formatted .pdf</span>
                      </button>

                      {/* JSON Download */}
                      <button
                        onClick={() =>
                          downloadFile(
                            exportToJSON(parsedChatMessages, chatTitle),
                            `${chatTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`,
                            "application/json"
                          )
                        }
                        className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-border bg-secondary/40 hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all cursor-pointer shadow-xs group"
                      >
                        <FileJson className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                        <span>Download JSON</span>
                        <span className="text-[10px] opacity-75 font-normal">Structured .json</span>
                      </button>
                    </div>

                    {/* Secondary Exporters */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
                      {/* Plain Text Download */}
                      <button
                        onClick={() =>
                          downloadFile(
                            exportToPlainText(parsedChatMessages, chatTitle),
                            `${chatTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`,
                            "text/plain"
                          )
                        }
                        className="py-2 px-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileCode className="h-3 w-3 text-muted" />
                        Text (.txt)
                      </button>

                      {/* CSV Download */}
                      <button
                        onClick={() =>
                          downloadFile(
                            exportToCSV(parsedChatMessages),
                            `${chatTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`,
                            "text/csv"
                          )
                        }
                        className="py-2 px-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Table className="h-3 w-3 text-muted" />
                        CSV (.csv)
                      </button>

                      {/* HTML Download */}
                      <button
                        onClick={() =>
                          downloadFile(
                            exportToHTML(parsedChatMessages, chatTitle),
                            `${chatTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.html`,
                            "text/html"
                          )
                        }
                        className="py-2 px-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3 text-muted" />
                        HTML (.html)
                      </button>
                    </div>

                    {/* Clipboard Quick Copy Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => triggerCopy(exportToMarkdown(parsedChatMessages, chatTitle), "copy-md")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "copy-md" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        {copiedKey === "copy-md" ? "Copied MD!" : "Copy MD"}
                      </button>
                      <button
                        onClick={() => triggerCopy(exportToJSON(parsedChatMessages, chatTitle), "copy-json")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "copy-json" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        {copiedKey === "copy-json" ? "Copied JSON!" : "Copy JSON"}
                      </button>
                      <button
                        onClick={() => triggerCopy(exportToPlainText(parsedChatMessages, chatTitle), "copy-txt")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "copy-txt" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        {copiedKey === "copy-txt" ? "Copied Text!" : "Copy Text"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Viewer & Editor */}
              {parsedChatMessages.length > 0 && (
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Conversation Preview ({filteredChatMessages.length})
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-40">
                        <Search className="h-3 w-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          type="text"
                          value={chatSearchFilter}
                          onChange={(e) => setChatSearchFilter(e.target.value)}
                          placeholder="Filter text..."
                          className="w-full text-[11px] rounded-md border border-input bg-card pl-7 pr-2 py-1 text-foreground focus:outline-none"
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="text-[11px] rounded-md border border-input bg-card px-2 py-1 text-foreground focus:outline-none"
                      >
                        <option value="all">All Roles</option>
                        <option value="user">User Only</option>
                        <option value="assistant">AI Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                          msg.role === "user"
                            ? "bg-primary/5 border-primary/20 text-foreground"
                            : "bg-secondary/40 border-border text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => toggleMessageRole(msg.id)}
                            className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider cursor-pointer ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-emerald-600 text-white"
                            }`}
                            title="Click to switch role"
                          >
                            {msg.role === "user" ? "User" : "Assistant (AI)"}
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => triggerCopy(msg.text, `msg-${msg.id}`)}
                              className="text-muted hover:text-foreground cursor-pointer"
                              title="Copy message"
                            >
                              {copiedKey === `msg-${msg.id}` ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="text-destructive/70 hover:text-destructive cursor-pointer"
                              title="Remove message"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed select-text font-sans">
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 2: JWT SECRET GENERATOR */}
      {/* ========================================================================= */}
      {activeSlug === "jwt-secret-generator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Key Parameters</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground block">Key Bit Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[256, 384, 512].map((bits) => (
                  <button
                    key={bits}
                    onClick={() => {
                      setJwtBits(bits as any);
                      setJwtResult(generateJWTSecret(bits as any, jwtEncoding));
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      jwtBits === bits
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-secondary/40 border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {bits}-bit
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="jwt-encoding-select" className="text-xs font-medium text-foreground block">Output Encoding</label>
              <select
                id="jwt-encoding-select"
                value={jwtEncoding}
                onChange={(e) => {
                  const enc = e.target.value as any;
                  setJwtEncoding(enc);
                  setJwtResult(generateJWTSecret(jwtBits, enc));
                }}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="base64">Base64 (Standard)</option>
                <option value="base64url">Base64URL (RFC 7515)</option>
                <option value="hex">Hexadecimal (Hex String)</option>
                <option value="plain">Alphanumeric ASCII</option>
              </select>
            </div>

            <button
              onClick={() => setJwtResult(generateJWTSecret(jwtBits, jwtEncoding))}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-Generate Cryptographic Key
            </button>
          </div>

          <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Generated Secret Key</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {jwtBits}-bit Entropy
                </span>
              </div>
              <div className="bg-card border border-border p-4 rounded-xl font-mono text-xs text-primary break-all select-all leading-relaxed min-h-24">
                {jwtResult}
              </div>
            </div>

            <button
              onClick={() => triggerCopy(jwtResult, "jwt-key")}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copiedKey === "jwt-key" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === "jwt-key" ? "Copied to Clipboard!" : "Copy Secret Key"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 3: JSON FORMATTER & VALIDATOR */}
      {/* ========================================================================= */}
      {activeSlug === "json-formatter" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted">JSON Input</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setJsonIndent(jsonIndent === 2 ? 4 : 2)}
                  className="text-[11px] text-muted hover:text-foreground font-semibold px-2 py-0.5 rounded bg-secondary cursor-pointer"
                >
                  Tab: {jsonIndent} spaces
                </button>
                <button
                  onClick={() => setJsonInput(`{"title": "Example Item", "count": 42, "active": true}`)}
                  className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                >
                  Sample
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              placeholder="Paste raw JSON here..."
              className="w-full rounded-lg border border-input bg-card p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />

            {!jsonProcessed.isValid && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-medium">
                {jsonProcessed.errorMessage}
              </div>
            )}
          </div>

          <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Formatted Output</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${jsonProcessed.isValid ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
                  {jsonProcessed.isValid ? "Valid JSON" : "Syntax Error"}
                </span>
              </div>

              <textarea
                readOnly
                value={jsonProcessed.formatted}
                rows={12}
                className="w-full rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground select-all leading-relaxed focus:outline-none"
              />

              {jsonProcessed.stats && (
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-card border border-border p-2 rounded">
                    <span className="text-[10px] text-muted block">Keys</span>
                    <span className="font-bold">{jsonProcessed.stats.keyCount}</span>
                  </div>
                  <div className="bg-card border border-border p-2 rounded">
                    <span className="text-[10px] text-muted block">Depth</span>
                    <span className="font-bold">{jsonProcessed.stats.depth}</span>
                  </div>
                  <div className="bg-card border border-border p-2 rounded">
                    <span className="text-[10px] text-muted block">Size</span>
                    <span className="font-bold">{jsonProcessed.stats.sizeBytes} B</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => triggerCopy(jsonProcessed.formatted, "json-copy")}
                className="flex-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                {copiedKey === "json-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "json-copy" ? "Copied JSON!" : "Copy Formatted"}
              </button>
              <button
                onClick={() => triggerCopy(jsonProcessed.minified, "json-mini-copy")}
                className="py-2 px-3 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === "json-mini-copy" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Minified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 4: BASE64 ENCODER / DECODER */}
      {/* ========================================================================= */}
      {activeSlug === "base64-encoder-decoder" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Input Content</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setB64Mode("encode");
                    setB64Encoded(encodeBase64(b64Text, b64UrlSafe));
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${b64Mode === "encode" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"}`}
                >
                  Encode
                </button>
                <button
                  onClick={() => {
                    setB64Mode("decode");
                    setB64Encoded(decodeBase64(b64Text, b64UrlSafe));
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${b64Mode === "decode" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"}`}
                >
                  Decode
                </button>
              </div>
            </div>

            <textarea
              value={b64Text}
              onChange={(e) => {
                setB64Text(e.target.value);
                setB64Encoded(b64Mode === "encode" ? encodeBase64(e.target.value, b64UrlSafe) : decodeBase64(e.target.value, b64UrlSafe));
              }}
              rows={8}
              placeholder={b64Mode === "encode" ? "Enter plain text to encode into Base64..." : "Enter Base64 string to decode into plain text..."}
              className="w-full rounded-lg border border-input bg-card p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={b64UrlSafe}
                onChange={(e) => {
                  const val = e.target.checked;
                  setB64UrlSafe(val);
                  setB64Encoded(b64Mode === "encode" ? encodeBase64(b64Text, val) : decodeBase64(b64Text, val));
                }}
                className="rounded accent-primary"
              />
              Use URL-Safe RFC 4648 Encoding (- and _ instead of + and /)
            </label>
          </div>

          <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {b64Mode === "encode" ? "Base64 Encoded Result" : "Decoded Plain Text"}
              </span>
              <textarea
                readOnly
                value={b64Encoded}
                rows={8}
                className="w-full rounded-lg border border-border bg-card p-3 font-mono text-xs text-primary select-all leading-relaxed focus:outline-none break-all"
              />
            </div>

            <button
              onClick={() => triggerCopy(b64Encoded, "b64-copy")}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copiedKey === "b64-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === "b64-copy" ? "Copied!" : "Copy Result"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 5: HASH & CHECKSUM GENERATOR */}
      {/* ========================================================================= */}
      {activeSlug === "hash-generator" && (
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="hash-raw-input" className="text-xs font-medium text-foreground">String / Payload to Hash</label>
              <textarea
                id="hash-raw-input"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-card p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hmac-secret-input" className="text-xs font-medium text-foreground">
                Optional HMAC Secret Key (Leave blank for standard digests)
              </label>
              <input
                id="hmac-secret-input"
                type="text"
                value={hmacSecret}
                onChange={(e) => setHmacSecret(e.target.value)}
                placeholder="Optional shared secret..."
                className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "SHA-256 (Industry Standard)", value: hashResults.sha256, key: "sha256" },
              { label: "SHA-512 (High Security)", value: hashResults.sha512, key: "sha512" },
              { label: "SHA-384", value: hashResults.sha384, key: "sha384" },
              { label: "SHA-1 (Legacy Checksum)", value: hashResults.sha1, key: "sha1" },
              { label: "MD5 (Fast Checksum)", value: hashResults.md5, key: "md5" },
            ].map((item) => (
              <div key={item.key} className="bg-card border border-border p-4 rounded-xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{item.label}</span>
                  <button
                    onClick={() => triggerCopy(item.value, `hash-${item.key}`)}
                    className="text-xs text-muted hover:text-primary flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === `hash-${item.key}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === `hash-${item.key}` ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-xs text-primary break-all select-all bg-secondary/30 p-2.5 rounded-lg">
                  {item.value || "Computing..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 6: MARKDOWN LIVE CONVERTER */}
      {/* ========================================================================= */}
      {activeSlug === "markdown-previewer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Markdown Input</span>
              <button
                onClick={() =>
                  downloadFile(mdInput, "document.md", "text/markdown")
                }
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" /> Download .md
              </button>
            </div>
            <textarea
              value={mdInput}
              onChange={(e) => setMdInput(e.target.value)}
              rows={16}
              className="w-full rounded-lg border border-input bg-card p-3.5 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Rendered HTML Preview</span>
              <button
                onClick={() =>
                  downloadFile(
                    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:1rem;line-height:1.6}</style></head><body>${markdownToHtml(mdInput)}</body></html>`,
                    "document.html",
                    "text/html"
                  )
                }
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" /> Download HTML
              </button>
            </div>
            <div
              className="rounded-lg border border-border bg-secondary/10 p-4 max-h-[350px] overflow-y-auto prose dark:prose-invert prose-sm text-foreground text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(mdInput) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
