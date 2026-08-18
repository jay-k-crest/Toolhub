/**
 * Developer & Utility Tools Engine
 * JSON Formatter, Base64 Converter, Hash Generator, URL Encoder/Decoder, Markdown Converter, Color Converter
 */

// ==========================================
// 1. JSON FORMATTER & VALIDATOR
// ==========================================
export interface JsonValidationResult {
  isValid: boolean;
  formatted: string;
  minified: string;
  error?: string;
  line?: number;
  column?: number;
  stats: {
    byteSize: number;
    keyCount: number;
    arrayCount: number;
    depth: number;
  };
}

export function processJson(input: string, indent: number = 2): JsonValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: true,
      formatted: "",
      minified: "",
      stats: { byteSize: 0, keyCount: 0, arrayCount: 0, depth: 0 },
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);

    // Calculate stats
    let keyCount = 0;
    let arrayCount = 0;
    let maxDepth = 0;

    const traverse = (val: any, depth: number) => {
      if (depth > maxDepth) maxDepth = depth;
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          arrayCount++;
          val.forEach((item) => traverse(item, depth + 1));
        } else {
          const keys = Object.keys(val);
          keyCount += keys.length;
          keys.forEach((k) => traverse(val[k], depth + 1));
        }
      }
    };

    traverse(parsed, 1);

    return {
      isValid: true,
      formatted,
      minified,
      stats: {
        byteSize: new Blob([formatted]).size,
        keyCount,
        arrayCount,
        depth: maxDepth,
      },
    };
  } catch (err: any) {
    let line: number | undefined;
    let column: number | undefined;

    // Parse line/col from error message if available (e.g. "at position 45 (line 2 column 5)")
    const posMatch = err.message.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = trimmed.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      isValid: false,
      formatted: input,
      minified: "",
      error: err.message,
      line,
      column,
      stats: { byteSize: input.length, keyCount: 0, arrayCount: 0, depth: 0 },
    };
  }
}

// ==========================================
// 2. BASE64 ENCODER & DECODER
// ==========================================
export function encodeBase64(text: string, urlSafe = false): string {
  try {
    const utf8Bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    let encoded = btoa(binary);
    if (urlSafe) {
      encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return encoded;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

export function decodeBase64(b64: string): string {
  try {
    let normalized = b64.trim().replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if missing
    while (normalized.length % 4) {
      normalized += "=";
    }
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err: any) {
    return `Decoding Error: Invalid Base64 string`;
  }
}

// ==========================================
// 3. HASH & CHECKSUM GENERATOR
// ==========================================
export async function generateHashes(text: string, hmacKey = ""): Promise<{
  sha256: string;
  sha512: string;
  sha1: string;
  sha384: string;
  md5: string;
}> {
  const enc = new TextEncoder();
  const data = enc.encode(text);

  // Web Crypto API implementations
  const getSubtleHash = async (algo: string): Promise<string> => {
    try {
      if (hmacKey) {
        const keyData = enc.encode(hmacKey);
        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: { name: algo } },
          false,
          ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
        return bufToHex(signature);
      } else {
        const hashBuf = await crypto.subtle.digest(algo, data);
        return bufToHex(hashBuf);
      }
    } catch {
      return "Algorithm not supported";
    }
  };

  const bufToHex = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const sha256 = await getSubtleHash("SHA-256");
  const sha512 = await getSubtleHash("SHA-512");
  const sha1 = await getSubtleHash("SHA-1");
  const sha384 = await getSubtleHash("SHA-384");
  const md5 = simpleMd5(text);

  return { sha256, sha512, sha1, sha384, md5 };
}

// Lightweight MD5 fallback
function simpleMd5(str: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function utf8Encode(s: string) {
    return unescape(encodeURIComponent(s));
  }

  const x = Array<number>();
  let k, AA, BB, CC, DD, a, b, c, d;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  const sUtf8 = utf8Encode(str);
  const lWordCount = (((sUtf8.length + 8) >> 6) + 1) * 16;
  for (let i = 0; i < lWordCount; i++) x[i] = 0;
  for (let i = 0; i < sUtf8.length; i++) {
    x[i >> 2] |= (sUtf8.charCodeAt(i) & 0xff) << ((i % 4) * 8);
  }
  x[sUtf8.length >> 2] |= 0x80 << ((sUtf8.length % 4) * 8);
  x[lWordCount - 2] = sUtf8.length * 8;

  a = 0x67452301; b = 0xefcdab89; c = 0x98badcfe; d = 0x10325476;

  for (k = 0; k < lWordCount; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478); d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db); b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf); d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8); d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1); b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122); d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e); b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562); d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51); b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681); b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6); d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87); b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905); d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9); b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122); b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44); d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60); b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6); d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039); d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8); b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7); b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3); d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d); b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f); d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82); d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb); b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }

  const wordToHex = (lValue: number) => {
    let wordToHexValue = "", wordToHexValueTemp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue += wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  };

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// ==========================================
// 4. URL ENCODER / DECODER & PARAM PARSER
// ==========================================
export interface ParsedUrlDetails {
  protocol: string;
  host: string;
  pathname: string;
  hash: string;
  params: Array<{ key: string; value: string }>;
  encoded: string;
  decoded: string;
}

export function parseAndConvertUrl(input: string): ParsedUrlDetails {
  const trimmed = input.trim();
  let protocol = "";
  let host = "";
  let pathname = "";
  let hash = "";
  const params: Array<{ key: string; value: string }> = [];

  try {
    const urlObj = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    protocol = urlObj.protocol;
    host = urlObj.host;
    pathname = urlObj.pathname;
    hash = urlObj.hash;
    urlObj.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
  } catch {
    // If not a full URL, parse query params if present
    if (trimmed.includes("?")) {
      const qs = trimmed.split("?")[1].split("#")[0];
      const sp = new URLSearchParams(qs);
      sp.forEach((value, key) => params.push({ key, value }));
    }
  }

  const encoded = encodeURIComponent(trimmed);
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {}

  return { protocol, host, pathname, hash, params, encoded, decoded };
}

// ==========================================
// 5. MARKDOWN TO HTML CONVERTER
// ==========================================
export function markdownToHtml(md: string): string {
  if (!md) return "";

  let html = md
    // Escape HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks ```lang ... ```
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gim, (_, lang, code) => {
    return `<pre class="bg-secondary/60 p-4 rounded-lg overflow-x-auto text-xs font-mono my-4 border border-border"><code>${code.trim()}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-primary">$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 pb-1 border-b border-border">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-8 mb-4">$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-2 text-muted italic">$1</blockquote>');

  // Bold and Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>');

  // Unordered list items
  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

  // Ordered list items
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p class="my-3 leading-relaxed">');

  return `<div class="prose-content"><p class="my-3 leading-relaxed">${html}</p></div>`;
}

// ==========================================
// 6. COLOR CONVERTER & WCAG CONTRAST CHECKER
// ==========================================
export interface ColorDetails {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  contrastWithWhite: number;
  contrastWithBlack: number;
  wcagWhiteRating: "AAA" | "AA" | "Fail";
  wcagBlackRating: "AAA" | "AA" | "Fail";
}

export function convertColor(hexInput: string): ColorDetails | null {
  let hex = hexInput.trim().replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  // RGB to CMYK
  let c = 0, m = 0, y = 0, k = 1 - max;
  if (max > 0) {
    c = (1 - rNorm - k) / (1 - k);
    m = (1 - gNorm - k) / (1 - k);
    y = (1 - bNorm - k) / (1 - k);
  }

  // Relative Luminance for WCAG Contrast
  const getLuminance = (rVal: number, gVal: number, bVal: number) => {
    const a = [rVal, gVal, bVal].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(r, g, b);
  const lumWhite = getLuminance(255, 255, 255);
  const lumBlack = getLuminance(0, 0, 0);

  const contrastWhite = (lumWhite + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / (lumBlack + 0.05);

  const getRating = (ratio: number): "AAA" | "AA" | "Fail" => {
    if (ratio >= 7.0) return "AAA";
    if (ratio >= 4.5) return "AA";
    return "Fail";
  };

  return {
    hex: `#${hex.toUpperCase()}`,
    rgb: { r, g, b },
    hsl: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) },
    cmyk: { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) },
    contrastWithWhite: parseFloat(contrastWhite.toFixed(2)),
    contrastWithBlack: parseFloat(contrastBlack.toFixed(2)),
    wcagWhiteRating: getRating(contrastWhite),
    wcagBlackRating: getRating(contrastBlack),
  };
}
