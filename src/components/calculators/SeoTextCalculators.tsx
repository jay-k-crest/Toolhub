import React, { useState, useEffect } from "react";
import {
  convertCase,
  textToSlug,
  generateLoremIpsum,
  checkMetaLength,
  parseAIChatHTML,
  type ChatMessage,
} from "../../lib/calculators/seo-text-calculators";

interface SeoTextProps {
  slug: string;
}

export default function SeoTextCalculators({ slug }: SeoTextProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Case Converter states
  const [caseText, setCaseText] = useState("Enter your text to convert case style.");
  const [caseMode, setCaseMode] = useState<"upper" | "lower" | "title" | "sentence" | "slug">("upper");

  // Slug states
  const [slugText, setSlugText] = useState("Tools and Calculators Suite");

  // Lorem Ipsum states
  const [loremCount, setLoremCount] = useState(3);
  const [loremUnit, setLoremUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [loremResult, setLoremResult] = useState("");

  // Reading Time states
  const [readingText, setReadingText] = useState("Enter text to calculate reading time duration.");

  // Meta Tag states
  const [metaTitle, setMetaTitle] = useState("ToolHub — Free Online Calculators Suite");
  const [metaDesc, setMetaDesc] = useState("Calculate EMIs, compound interest, BMI, ideal weight, attendance requirements, and convert timezones instantly with our free tools.");

  // QR Code states
  const [qrText, setQrText] = useState("https://toolhub.com");

  // AI Chat Exporter states
  const [chatLink, setChatLink] = useState("");
  const [chatRawContent, setChatRawContent] = useState("");
  const [parsedChatMessages, setParsedChatMessages] = useState<ChatMessage[]>([]);
  const [parseError, setParseError] = useState("");

  // Calculations
  const convertedCaseResult = convertCase(caseText, caseMode);
  const slugifiedResult = textToSlug(slugText);
  const metaCheckResult = checkMetaLength(metaTitle, metaDesc);
  
  // Reading Time calculation: WPM 225
  const wordsCount = readingText.trim() === "" ? 0 : readingText.trim().split(/\s+/).length;
  const readingTimeSecs = Math.round((wordsCount / 225) * 60);

  const seoTextTools = [
    { slug: "case-converter", label: "Case Converter" },
    { slug: "text-to-slug-converter", label: "Text to Slug" },
    { slug: "lorem-ipsum-generator", label: "Lorem Ipsum" },
    { slug: "reading-time-calculator", label: "Reading Time" },
    { slug: "meta-tag-length-checker", label: "Meta Tag Length" },
    { slug: "qr-code-generator", label: "QR Code Generator" },
  ];

  // AI Chat Parser action
  const handleParseChat = async () => {
    setParseError("");
    setParsedChatMessages([]);

    let contentToParse = chatRawContent.trim();

    // If link is provided, try to fetch it via a CORS proxy first
    if (chatLink.trim()) {
      try {
        const targetUrl = chatLink.trim();
        // Use AllOrigins open CORS proxy
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        if (!response.ok) throw new Error("CORS Proxy request failed.");
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
        setParseError("No messages could be extracted. Check the pasted source formatting.");
      } else {
        setParsedChatMessages(messages);
      }
    } catch (err: any) {
      setParseError(`Parsing error: ${err.message}`);
    }
  };

  // Download parsed chat JSON
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
        {seoTextTools.map((t) => (
          <a
            key={t.slug}
            href={`/seo-text/${t.slug}/`}
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

          {/* 1. Case Converter */}
          {activeSlug === "case-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="case-input" className="text-sm font-medium text-foreground">Text to Convert</label>
                <textarea
                  id="case-input"
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  rows={5}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="case-mode-sel" className="text-sm font-medium text-foreground">Select Mode</label>
                <select
                  id="case-mode-sel"
                  value={caseMode}
                  onChange={(e) => setCaseMode(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case</option>
                  <option value="sentence">Sentence case</option>
                  <option value="slug">URL Slugify</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. Text to Slug */}
          {activeSlug === "text-to-slug-converter" && (
            <div className="space-y-1.5">
              <label htmlFor="slug-text-inp" className="text-sm font-medium text-foreground">Text to Slugify</label>
              <input
                id="slug-text-inp"
                type="text"
                value={slugText}
                onChange={(e) => setSlugText(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 3. Lorem Ipsum */}
          {activeSlug === "lorem-ipsum-generator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="lorem-cnt" className="text-sm font-medium text-foreground">Count</label>
                  <input
                    id="lorem-cnt"
                    type="number"
                    value={loremCount}
                    onChange={(e) => setLoremCount(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lorem-unit-sel" className="text-sm font-medium text-foreground">Unit</label>
                  <select
                    id="lorem-unit-sel"
                    value={loremUnit}
                    onChange={(e) => setLoremUnit(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="paragraphs">Paragraphs</option>
                    <option value="sentences">Sentences</option>
                    <option value="words">Words</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setLoremResult(generateLoremIpsum(loremCount, loremUnit))}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Generate Placeholder Text
              </button>
            </div>
          )}

          {/* 4. Reading Time */}
          {activeSlug === "reading-time-calculator" && (
            <div className="space-y-1.5">
              <label htmlFor="reading-text-val" className="text-sm font-medium text-foreground">Content Text</label>
              <textarea
                id="reading-text-val"
                value={readingText}
                onChange={(e) => setReadingText(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 5. Meta Tag Checker */}
          {activeSlug === "meta-tag-length-checker" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="meta-title-inp" className="text-sm font-medium text-foreground">Meta Title</label>
                <input
                  id="meta-title-inp"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="meta-desc-inp" className="text-sm font-medium text-foreground">Meta Description</label>
                <textarea
                  id="meta-desc-inp"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 6. QR Code */}
          {activeSlug === "qr-code-generator" && (
            <div className="space-y-1.5">
              <label htmlFor="qr-data-inp" className="text-sm font-medium text-foreground">URL or Text for QR Code</label>
              <input
                id="qr-data-inp"
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 7. AI Chat Exporter */}
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

            {/* 1. Case Converter Results */}
            {activeSlug === "case-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Output Text</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-sm font-semibold select-all text-foreground min-h-24 max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {convertedCaseResult}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Text to Slug Results */}
            {activeSlug === "text-to-slug-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">URL Slug Output</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-sm font-semibold select-all font-mono text-primary">
                    {slugifiedResult}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Lorem Ipsum Results */}
            {activeSlug === "lorem-ipsum-generator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Placeholder Output</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-xs font-semibold select-all text-foreground min-h-24 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                    {loremResult || "Click generate button"}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Reading Time Results */}
            {activeSlug === "reading-time-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Estimated Reading Time</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {readingTimeSecs}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">Seconds</span>
                </div>
                <div className="text-sm text-muted border-t border-border pt-4">
                  Total word count: <span className="font-bold text-foreground tabular-nums">{wordsCount}</span> words.
                </div>
              </div>
            )}

            {/* 5. Meta Tag Checker / Google SERP Preview */}
            {activeSlug === "meta-tag-length-checker" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Google SERP Preview</span>
                  <div className="bg-card border border-border p-4 rounded-lg shadow-sm font-sans space-y-1 text-left max-w-sm">
                    <span className="text-xs text-muted block">https://toolhub.com › tool</span>
                    <a href="#" className="text-[#1a0dab] hover:underline text-lg font-normal leading-tight block font-heading">
                      {metaTitle.slice(0, 60)}{metaTitle.length > 60 ? "..." : ""}
                    </a>
                    <p className="text-sm text-[#4d5156] leading-snug">
                      {metaDesc.slice(0, 155)}{metaDesc.length > 155 ? "..." : ""}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-3 text-xs text-foreground">
                  <div className="flex justify-between items-center">
                    <span>Title length: {metaCheckResult.titleLength}/60 chars ({metaCheckResult.titlePixelWidth}px)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      metaCheckResult.titleStatus === "good" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {metaCheckResult.titleStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-2">
                    <span>Desc length: {metaCheckResult.descLength}/160 chars ({metaCheckResult.descPixelWidth}px)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      metaCheckResult.descStatus === "good" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {metaCheckResult.descStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. QR Code Results */}
            {activeSlug === "qr-code-generator" && (
              <div className="space-y-4 flex flex-col items-center">
                <span className="text-xs text-muted block uppercase tracking-wider self-start">Generated QR Code</span>
                <div className="bg-white p-3 rounded-lg border border-border mt-2">
                  <img
                    alt="QR Code Output"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrText)}`}
                    className="h-36 w-36"
                  />
                </div>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md mt-4 hover:bg-primary/95"
                >
                  Open High-Res QR
                </a>
              </div>
            )}

            {/* 7. AI Chat Exporter Results */}
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
