import React, { useState, useEffect } from "react";
import {
  convertCase,
  textToSlug,
  generateLoremIpsum,
  checkMetaLength,
} from "../../lib/calculators/seo-text-calculators";
import { parseAndConvertUrl } from "../../lib/calculators/developer-tools";
import {
  Type,
  Link,
  FileText,
  Clock,
  Search,
  QrCode,
  ArrowRightLeft,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface SeoTextProps {
  slug: string;
}

export default function SeoTextCalculators({ slug }: SeoTextProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Case Converter states
  const [caseText, setCaseText] = useState("Empower your workflow with high performance developer utilities.");
  const [caseMode, setCaseMode] = useState<"upper" | "lower" | "title" | "sentence" | "slug">("title");

  // Slug states
  const [slugText, setSlugText] = useState("Best Online Free Tools Suite 2026");

  // Lorem Ipsum states
  const [loremCount, setLoremCount] = useState(3);
  const [loremUnit, setLoremUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [loremResult, setLoremResult] = useState(() => generateLoremIpsum(3, "paragraphs"));

  // Reading Time states
  const [readingText, setReadingText] = useState("ToolHub provides instant, private, browser-based computing tools across finance, health, math, unit converters, and developer utilities. All computations run 100% locally on your machine without transmitting any personal inputs to external cloud servers.");

  // Meta Tag states
  const [metaTitle, setMetaTitle] = useState("ToolHub — Free Online Calculators Suite");
  const [metaDesc, setMetaDesc] = useState("Calculate EMIs, compound interest, BMI, attendance requirements, and convert timezones instantly with our free online suite.");

  // QR Code states
  const [qrText, setQrText] = useState("https://www.toolhubs.me");
  const [qrSize, setQrSize] = useState<number>(200);

  // URL Encoder / Decoder states
  const [urlInput, setUrlInput] = useState("https://example.com/search?query=developer+tools&category=web&sort=desc#results");
  const urlDetails = parseAndConvertUrl(urlInput);

  // Calculations
  const convertedCaseResult = convertCase(caseText, caseMode);
  const slugifiedResult = textToSlug(slugText);
  const metaCheckResult = checkMetaLength(metaTitle, metaDesc);
  const wordsCount = readingText.trim() === "" ? 0 : readingText.trim().split(/\s+/).length;
  const readingTimeSecs = Math.max(1, Math.round((wordsCount / 225) * 60));

  const seoTextTools = [
    { slug: "case-converter", label: "Case Converter", icon: Type },
    { slug: "text-to-slug-converter", label: "Text to Slug", icon: Link },
    { slug: "lorem-ipsum-generator", label: "Lorem Ipsum Generator", icon: FileText },
    { slug: "reading-time-calculator", label: "Reading Time Calculator", icon: Clock },
    { slug: "meta-tag-length-checker", label: "Meta Tag SERP Checker", icon: Search },
    { slug: "qr-code-generator", label: "QR Code Generator", icon: QrCode },
    { slug: "url-encoder-decoder", label: "URL Encoder & Param Parser", icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {seoTextTools.map((t) => {
          const Icon = t.icon;
          const isActive = activeSlug === t.slug;
          return (
            <a
              key={t.slug}
              href={`/seo-text/${t.slug}/`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/40 text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Input Settings</h3>

          {/* 1. Case Converter */}
          {activeSlug === "case-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="case-input" className="text-xs font-medium text-foreground">Text to Convert</label>
                <textarea
                  id="case-input"
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="case-mode-sel" className="text-xs font-medium text-foreground">Desired Case Format</label>
                <select
                  id="case-mode-sel"
                  value={caseMode}
                  onChange={(e) => setCaseMode(e.target.value as any)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case (Capitalize Every Word)</option>
                  <option value="sentence">Sentence case (First letter capitalized)</option>
                  <option value="slug">URL-safe-slug-case</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. Text to Slug */}
          {activeSlug === "text-to-slug-converter" && (
            <div className="space-y-1.5">
              <label htmlFor="slug-text-inp" className="text-xs font-medium text-foreground">String to Convert to URL Slug</label>
              <input
                id="slug-text-inp"
                type="text"
                value={slugText}
                onChange={(e) => setSlugText(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* 3. Lorem Ipsum */}
          {activeSlug === "lorem-ipsum-generator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="lorem-cnt" className="text-xs font-medium text-foreground">Quantity</label>
                  <input
                    id="lorem-cnt"
                    type="number"
                    min="1"
                    max="50"
                    value={loremCount}
                    onChange={(e) => setLoremCount(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lorem-unit-sel" className="text-xs font-medium text-foreground">Unit</label>
                  <select
                    id="lorem-unit-sel"
                    value={loremUnit}
                    onChange={(e) => setLoremUnit(e.target.value as any)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="paragraphs">Paragraphs</option>
                    <option value="sentences">Sentences</option>
                    <option value="words">Words</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setLoremResult(generateLoremIpsum(loremCount, loremUnit))}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" /> Generate Dummy Copy
              </button>
            </div>
          )}

          {/* 4. Reading Time */}
          {activeSlug === "reading-time-calculator" && (
            <div className="space-y-1.5">
              <label htmlFor="reading-text-val" className="text-xs font-medium text-foreground">Article or Document Content</label>
              <textarea
                id="reading-text-val"
                value={readingText}
                onChange={(e) => setReadingText(e.target.value)}
                rows={7}
                className="w-full rounded-lg border border-input bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
              />
            </div>
          )}

          {/* 5. Meta Tag Checker */}
          {activeSlug === "meta-tag-length-checker" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="meta-title-inp" className="text-xs font-medium text-foreground">Page Meta Title</label>
                <input
                  id="meta-title-inp"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="meta-desc-inp" className="text-xs font-medium text-foreground">Meta Description</label>
                <textarea
                  id="meta-desc-inp"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* 6. QR Code */}
          {activeSlug === "qr-code-generator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="qr-data-inp" className="text-xs font-medium text-foreground">Destination URL or Text</label>
                <input
                  id="qr-data-inp"
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="qr-size-sel" className="text-xs font-medium text-foreground">QR Resolution</label>
                <select
                  id="qr-size-sel"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="180">Standard (180x180 px)</option>
                  <option value="300">High Quality (300x300 px)</option>
                  <option value="500">Print Quality (500x500 px)</option>
                </select>
              </div>
            </div>
          )}

          {/* 7. URL Encoder / Decoder */}
          {activeSlug === "url-encoder-decoder" && (
            <div className="space-y-3">
              <label htmlFor="url-inp-field" className="text-xs font-medium text-foreground">Full URL or Query String</label>
              <textarea
                id="url-inp-field"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                rows={5}
                placeholder="https://example.com/?key=value..."
                className="w-full rounded-lg border border-input bg-card p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Formatted Output</h3>

            {/* 1. Case Converter Results */}
            {activeSlug === "case-converter" && (
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-xl p-4 text-sm font-medium text-foreground select-all min-h-24 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {convertedCaseResult}
                </div>
                <button
                  onClick={() => triggerCopy(convertedCaseResult, "case-copy")}
                  className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedKey === "case-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "case-copy" ? "Copied!" : "Copy Result"}
                </button>
              </div>
            )}

            {/* 2. Text to Slug Results */}
            {activeSlug === "text-to-slug-converter" && (
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm font-bold text-primary select-all break-all">
                  {slugifiedResult}
                </div>
                <button
                  onClick={() => triggerCopy(slugifiedResult, "slug-copy")}
                  className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedKey === "slug-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "slug-copy" ? "Slug Copied!" : "Copy URL Slug"}
                </button>
              </div>
            )}

            {/* 3. Lorem Ipsum Results */}
            {activeSlug === "lorem-ipsum-generator" && (
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-xl p-4 text-xs font-mono text-foreground select-all min-h-28 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {loremResult}
                </div>
                <button
                  onClick={() => triggerCopy(loremResult, "lorem-copy")}
                  className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedKey === "lorem-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "lorem-copy" ? "Copied Lorem Text!" : "Copy Placeholder Text"}
                </button>
              </div>
            )}

            {/* 4. Reading Time Results */}
            {activeSlug === "reading-time-calculator" && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5 text-center space-y-1">
                  <span className="text-xs uppercase font-bold text-muted block">Estimated Read Duration</span>
                  <span className="text-4xl font-heading font-black text-primary tabular-nums">{readingTimeSecs}</span>
                  <span className="text-sm font-bold text-foreground block">Seconds (at 225 WPM)</span>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 flex justify-around text-center text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">Words</span>
                    <span className="font-bold text-foreground tabular-nums">{wordsCount}</span>
                  </div>
                  <div className="border-l border-border pl-6">
                    <span className="text-muted block text-[10px] uppercase font-bold">Characters</span>
                    <span className="font-bold text-foreground tabular-nums">{readingText.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Google SERP Preview */}
            {activeSlug === "meta-tag-length-checker" && (
              <div className="space-y-4">
                <div className="bg-card border border-border p-4 rounded-xl shadow-xs space-y-1.5 text-left">
                  <span className="text-[11px] text-muted block truncate font-mono">https://www.toolhubs.me › preview</span>
                  <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-base font-medium leading-tight line-clamp-1">
                    {metaTitle || "Untitled Document"}
                  </div>
                  <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">
                    {metaDesc || "No description provided."}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-card border border-border p-2.5 rounded-lg">
                    <span>Title: <strong>{metaCheckResult.titleLength} / 60</strong> chars</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${metaCheckResult.titleStatus === "good" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                      {metaCheckResult.titleStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-card border border-border p-2.5 rounded-lg">
                    <span>Description: <strong>{metaCheckResult.descLength} / 160</strong> chars</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${metaCheckResult.descStatus === "good" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                      {metaCheckResult.descStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. QR Code Results */}
            {activeSlug === "qr-code-generator" && (
              <div className="space-y-4 flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl border border-border shadow-xs">
                  <img
                    alt="Live QR Code"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrText || "https://www.toolhubs.me")}`}
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrText || "https://www.toolhubs.me")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open Full-Res Download
                </a>
              </div>
            )}

            {/* 7. URL Encoder / Decoder Results */}
            {activeSlug === "url-encoder-decoder" && (
              <div className="space-y-3">
                <div className="bg-card border border-border p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Encoded Component</span>
                  <div className="font-mono text-xs text-primary break-all select-all">{urlDetails.encoded}</div>
                </div>

                {urlDetails.params.length > 0 && (
                  <div className="bg-card border border-border p-3 rounded-lg space-y-2">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">
                      Parsed Query Parameters ({urlDetails.params.length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {urlDetails.params.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-mono border-b border-border/50 pb-1">
                          <span className="text-muted font-bold">{p.key}:</span>
                          <span className="text-foreground truncate max-w-[160px]">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
