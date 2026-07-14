import React, { useState, useEffect } from "react";
import { generateJWTSecret } from "../../lib/calculators/math-calculators";
import { parseAIChatHTML, type ChatMessage } from "../../lib/calculators/seo-text-calculators";

interface DeveloperAiProps {
  slug: string;
}

export default function DeveloperAiCalculators({ slug }: DeveloperAiProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // JWT states
  const [jwtBits, setJwtBits] = useState<256 | 384 | 512>(256);
  const [jwtEncoding, setJwtEncoding] = useState<"base64" | "base64url" | "hex" | "plain">("base64");
  const [jwtResult, setJwtResult] = useState("");

  // AI Chat Exporter states
  const [chatLink, setChatLink] = useState("");
  const [chatRawContent, setChatRawContent] = useState("");
  const [parsedChatMessages, setParsedChatMessages] = useState<ChatMessage[]>([]);
  const [parseError, setParseError] = useState("");

  const devAiTools = [
    { slug: "jwt-secret-generator", label: "JWT Secret Generator" },
    { slug: "ai-chat-to-json", label: "AI Chat Exporter" },
  ];

  // AI Chat Exporter parser
  const handleParseChat = async () => {
    setParseError("");
    setParsedChatMessages([]);

    let contentToParse = chatRawContent.trim();

    // Try fetching if link is supplied
    if (chatLink.trim()) {
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(chatLink.trim())}`);
        if (!response.ok) throw new Error("CORS Proxy error");
        const data = await response.json();
        if (data.contents) {
          contentToParse = data.contents;
        }
      } catch (e) {
        setParseError("Could not fetch link directly due to CORS restrictions. Please copy-paste the raw Page Source / HTML of the shared page below instead.");
        return;
      }
    }

    if (!contentToParse) {
      setParseError("Please enter a link or paste raw HTML / Chat transcript.");
      return;
    }

    try {
      const messages = parseAIChatHTML(contentToParse);
      if (messages.length === 0) {
        setParseError("No messages could be extracted. Check your source data format.");
      } else {
        setParsedChatMessages(messages);
      }
    } catch (err: any) {
      setParseError(`Parsing error: ${err.message}`);
    }
  };

  const downloadChatJSON = () => {
    if (parsedChatMessages.length === 0) return;
    const blob = new Blob([JSON.stringify(parsedChatMessages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai_chat_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {devAiTools.map((t) => (
          <a
            key={t.slug}
            href={`/developer-ai/${t.slug}/`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSlug === t.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* 1. JWT Secret Generator */}
          {activeSlug === "jwt-secret-generator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="jwt-bits-sel" className="text-sm font-medium text-foreground">Secret Key Length</label>
                <select
                  id="jwt-bits-sel"
                  value={jwtBits}
                  onChange={(e) => setJwtBits(Number(e.target.value) as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="256">256-bit (32 bytes - HS256 recommended)</option>
                  <option value="384">384-bit (48 bytes - HS384)</option>
                  <option value="512">512-bit (64 bytes - HS512)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="jwt-enc-sel" className="text-sm font-medium text-foreground">Encoding Format</label>
                <select
                  id="jwt-enc-sel"
                  value={jwtEncoding}
                  onChange={(e) => setJwtEncoding(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="base64">Base64 Standard</option>
                  <option value="base64url">Base64URL (URL-safe, no padding)</option>
                  <option value="hex">Hexadecimal (0-9, a-f)</option>
                  <option value="plain">Plain Text (ASCII Printable characters)</option>
                </select>
              </div>
              <button
                onClick={() => setJwtResult(generateJWTSecret(jwtBits, jwtEncoding))}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Generate JWT Secret
              </button>
            </div>
          )}

          {/* 2. AI Chat Exporter */}
          {activeSlug === "ai-chat-to-json" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="chat-link-inp" className="text-sm font-medium text-foreground">Public Share Link (ChatGPT/Claude/xAI)</label>
                <input
                  id="chat-link-inp"
                  type="text"
                  value={chatLink}
                  onChange={(e) => setChatLink(e.target.value)}
                  placeholder="https://chatgpt.com/share/..."
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="chat-raw-inp" className="text-sm font-medium text-foreground">Or Paste Raw Page Source HTML / Text Transcript</label>
                <textarea
                  id="chat-raw-inp"
                  value={chatRawContent}
                  onChange={(e) => setChatRawContent(e.target.value)}
                  rows={6}
                  placeholder="Paste HTML page source containing conversation or copy-paste text transcript here..."
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-xs font-semibold text-foreground focus:outline-none font-mono"
                />
              </div>
              {parseError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md text-xs font-semibold">
                  {parseError}
                </div>
              )}
              <button
                onClick={handleParseChat}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Extract Chat Conversation
              </button>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. JWT Secret Results */}
            {activeSlug === "jwt-secret-generator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Cryptographic Secret</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-sm font-semibold select-all font-mono break-all text-primary">
                    {jwtResult || "Click generate button"}
                  </div>
                </div>
                <div className="text-[10px] text-muted border-t border-border/50 pt-2 leading-relaxed">
                  Tip: Copy this secret directly into your `.env` or JWT auth settings. Keep it confidential.
                </div>
              </div>
            )}

            {/* 2. AI Chat Exporter Results */}
            {activeSlug === "ai-chat-to-json" && (
              <div className="space-y-4">
                <span className="text-xs text-muted block uppercase tracking-wider">Parsed Conversation Timeline</span>
                {parsedChatMessages.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {parsedChatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-3 text-xs leading-relaxed max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto text-right"
                            : "bg-card border border-border text-foreground mr-auto text-left"
                        }`}
                      >
                        <span className="block font-bold text-[9px] uppercase tracking-wider mb-1 opacity-70">
                          {msg.role}
                        </span>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted italic text-center py-8">
                    No conversation parsed yet. Paste HTML or shared link and click extract.
                  </div>
                )}
                {parsedChatMessages.length > 0 && (
                  <button
                    onClick={downloadChatJSON}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-md w-full mt-2"
                  >
                    Download JSON File
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
