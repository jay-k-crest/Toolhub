/**
 * AI Chat Multi-Format Exporter & Universal Parser Engine
 * Robust support for ChatGPT, Claude (Anthropic), Gemini, DeepSeek, Grok, Copilot, Perplexity,
 * raw clipboard pastes, Markdown dialogues, JSON exports, and HTML transcripts.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  text: string;
  timestamp?: string;
  model?: string;
}

export interface ChatExportMetadata {
  title: string;
  source: string;
  createdAt: string;
  totalMessages: number;
  totalWords: number;
  estimatedTokens: number;
}

/**
 * List of pure UI noise and button strings generated when copying from web chat clients
 * Note: Never remove speaker labels like 'Claude' or 'ChatGPT' here!
 */
const WEB_UI_NOISE_PATTERNS = [
  /^copy\s*code$/i,
  /^copied!?$/i,
  /^copy$/i,
  /^edit$/i,
  /^edit\s*message$/i,
  /^retry$/i,
  /^regenerate(\s*response)?$/i,
  /^share$/i,
  /^thumbs\s*(up|down)$/i,
  /^good\s*response$/i,
  /^bad\s*response$/i,
  /^read\s*aloud$/i,
  /^view\s*source$/i,
  /^switch\s*model$/i,
  /^thought\s*for\s*\d+\s*seconds?$/i,
  /^chatgpt\s*can\s*make\s*mistakes.*$/i,
  /^claude\s*(can\s*make\s*mistakes.*|is\s*an\s*ai.*)?$/i,
  /^gemini\s*(may\s*display\s*inaccurate\s*info.*|is\s*an\s*ai.*)?$/i,
  /^(deepseek|copilot|grok|perplexity)\s*can\s*make\s*mistakes.*$/i,
];

/**
 * Cleans web copy noise (e.g. action buttons, footer disclaimers) from raw clipboard pastes
 */
export function cleanAICopyArtifacts(rawText: string): string {
  const lines = rawText.split("\n");
  const cleaned: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isNoise = WEB_UI_NOISE_PATTERNS.some((pattern) => pattern.test(line));
    if (!isNoise) {
      cleaned.push(lines[i]);
    }
  }

  return cleaned.join("\n");
}

/**
 * Universal Parser for AI Chat Transcripts and Exports
 */
export function parseAIChatUniversal(rawInput: string): {
  messages: ChatMessage[];
  title: string;
  detectedFormat: string;
} {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { messages: [], title: "Untitled Conversation", detectedFormat: "Empty" };
  }

  // 1. Try parsing as JSON (OpenAI export, Anthropic export, standard array schemas, linear_conversation)
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      const jsonResult = parseChatFromJSON(parsed);
      if (jsonResult.messages.length > 0) {
        return { ...jsonResult, detectedFormat: "JSON Data / Official Export" };
      }
    } catch {
      // Not standard JSON, proceed
    }
  }

  // 2. Check for HTML with script tags, RSC React Flight streams, or embedded script JSON
  if (trimmed.includes("<html") || trimmed.includes("<script") || trimmed.includes("self.__next_f") || trimmed.includes("__NEXT_DATA__")) {
    const htmlJsonResult = extractFromHTMLScriptTags(trimmed);
    if (htmlJsonResult.messages.length > 0) {
      return { ...htmlJsonResult, detectedFormat: "ChatGPT / Web Shared Page HTML" };
    }
  }

  // 3. Try parsing HTML DOM if elements exist
  if (trimmed.includes("<div") || trimmed.includes("<article") || trimmed.includes("<section") || trimmed.includes("<p>") || trimmed.includes("<main") || trimmed.includes("class=")) {
    const domResult = parseFromHTMLMarkup(trimmed);
    if (domResult.messages.length > 0) {
      return { ...domResult, detectedFormat: "HTML DOM Transcript" };
    }
  }

  // Clean UI noise from text
  const cleanedText = cleanAICopyArtifacts(trimmed);

  // 4. Try parsing structured Markdown headers (### User, ### Assistant, **User:**, etc.)
  const mdResult = parseFromMarkdownDialogue(cleanedText);
  if (mdResult.messages.length > 0) {
    return { ...mdResult, detectedFormat: "Markdown Dialogue" };
  }

  // 5. Try parsing line-by-line speaker dialogue (User: ..., Claude, ChatGPT said:, etc.)
  const lineResult = parseFromLineDialogue(cleanedText);
  if (lineResult.messages.length > 0) {
    return { ...lineResult, detectedFormat: "Plain Text Dialogue" };
  }

  // 6. Try alternating paragraph blocks (if user pasted Q&A blocks separated by blank lines)
  const paragraphResult = parseFromAlternatingParagraphs(cleanedText);
  if (paragraphResult.messages.length > 0) {
    return { ...paragraphResult, detectedFormat: "Alternating Paragraph Dialogue" };
  }

  // 7. If it's plain text without speaker tags, treat as a single user prompt
  if (cleanedText.length > 0 && !cleanedText.startsWith("<")) {
    return {
      messages: [
        {
          id: "msg-1",
          role: "user",
          text: cleanedText,
          timestamp: new Date().toISOString(),
        },
      ],
      title: "Imported Message",
      detectedFormat: "Single Prompt",
    };
  }

  return {
    messages: [],
    title: "Empty Input",
    detectedFormat: "Unknown",
  };
}

/**
 * Parses JSON formats from OpenAI, Anthropic, or standard array schemas
 */
function parseChatFromJSON(data: any): { messages: ChatMessage[]; title: string } {
  const messages: ChatMessage[] = [];
  let title = "Exported Conversation";

  if (!data) return { messages, title };

  // Case A: OpenAI linear_conversation array (from modern share API or RSC flight data)
  if (data.linear_conversation && Array.isArray(data.linear_conversation)) {
    title = data.title || "ChatGPT Conversation";
    data.linear_conversation.forEach((item: any, idx: number) => {
      const msgObj = item.message || item;
      const role = normalizeRole(msgObj.author?.role || msgObj.role);
      let text = "";
      if (msgObj.content?.parts && Array.isArray(msgObj.content.parts)) {
        text = msgObj.content.parts.filter((p: any) => typeof p === "string").join("\n").trim();
      } else if (msgObj.content?.text) {
        text = msgObj.content.text;
      } else if (typeof msgObj.content === "string") {
        text = msgObj.content;
      } else if (msgObj.text) {
        text = msgObj.text;
      }
      if (text) {
        messages.push({
          id: item.id || msgObj.id || `msg-${idx + 1}`,
          role,
          text: text.trim(),
          timestamp: msgObj.create_time ? new Date(msgObj.create_time * 1000).toISOString() : undefined,
          model: msgObj.metadata?.model_slug,
        });
      }
    });
    if (messages.length > 0) return { messages, title };
  }

  // Case B: Anthropic / Claude export format with `chat_messages`
  if (data.chat_messages && Array.isArray(data.chat_messages)) {
    title = data.name || data.title || "Claude Conversation";
    data.chat_messages.forEach((item: any, idx: number) => {
      const role = normalizeRole(item.sender || item.role);
      let text = item.text || "";
      if (!text && Array.isArray(item.content)) {
        text = item.content.map((c: any) => (typeof c === "string" ? c : c?.text || "")).filter(Boolean).join("\n");
      }
      if (text && text.trim()) {
        messages.push({
          id: item.uuid || item.id || `msg-${idx + 1}`,
          role,
          text: text.trim(),
          timestamp: item.created_at || item.updated_at,
        });
      }
    });
    if (messages.length > 0) return { messages, title };
  }

  // Case C: Array of conversations (e.g. Anthropic export containing list of chats)
  if (Array.isArray(data) && data.length > 0 && data[0]?.chat_messages) {
    return parseChatFromJSON(data[0]);
  }

  // Case D: OpenAI conversations.json single object or mapping structure
  if (data.mapping && typeof data.mapping === "object") {
    title = data.title || "ChatGPT Conversation";
    const mapping = data.mapping;
    const temp: Array<{ node: any; time: number; idx: number }> = [];
    let counter = 0;

    for (const key in mapping) {
      const node = mapping[key];
      if (node?.message?.content?.parts) {
        const text = node.message.content.parts.filter((p: any) => typeof p === "string").join("\n").trim();
        const role = normalizeRole(node.message.author?.role);
        const time = node.message.create_time || 0;
        if (text && (role === "user" || role === "assistant" || role === "system")) {
          temp.push({
            node: { id: node.id || key, role, text, timestamp: time ? new Date(time * 1000).toISOString() : undefined },
            time,
            idx: counter++,
          });
        }
      }
    }

    if (temp.length > 0) {
      temp.sort((a, b) => (a.time === b.time ? a.idx - b.idx : a.time - b.time));
      return {
        messages: temp.map((t) => t.node),
        title,
      };
    }
  }

  // Case E: Array of message objects [{role, content}, ...] or [{role, text}] or [{author, message}]
  if (Array.isArray(data)) {
    data.forEach((item, idx) => {
      if (!item || typeof item !== "object") return;
      const role = normalizeRole(item.role || item.author || item.sender || (idx % 2 === 0 ? "user" : "assistant"));
      const text = extractTextFromMessage(item.content || item.text || item.message || item.parts);
      if (text) {
        messages.push({
          id: item.id || `msg-${idx + 1}`,
          role,
          text,
          timestamp: item.timestamp || item.created_at || item.time,
          model: item.model,
        });
      }
    });
    return { messages, title };
  }

  // Case F: Standard wrapper { title, messages: [...] } or { chat: [...] } or { conversation: [...] }
  const messageList = data.messages || data.conversation || data.chat || data.history || data.data;
  if (Array.isArray(messageList)) {
    title = data.title || data.name || title;
    messageList.forEach((item, idx) => {
      if (!item || typeof item !== "object") return;
      const role = normalizeRole(item.role || item.author || item.sender || (idx % 2 === 0 ? "user" : "assistant"));
      const text = extractTextFromMessage(item.content || item.text || item.message || item.parts);
      if (text) {
        messages.push({
          id: item.id || `msg-${idx + 1}`,
          role,
          text,
          timestamp: item.timestamp || item.created_at,
          model: item.model,
        });
      }
    });
    return { messages, title };
  }

  return { messages, title };
}

/**
 * Extracts chat data from HTML script payloads (Next.js __NEXT_DATA__, RSC Flight Streams, or embedded JSON)
 */
function extractFromHTMLScriptTags(html: string): { messages: ChatMessage[]; title: string } {
  try {
    // 1. Next.js __NEXT_DATA__
    const nextMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextMatch && nextMatch[1]) {
      const nextData = JSON.parse(nextMatch[1]);
      const pageProps = nextData.props?.pageProps || {};
      const conv = pageProps.serverResponse?.data || pageProps.sharedConversationResponse || pageProps.conversation || {};
      const res = parseChatFromJSON(conv);
      if (res.messages.length > 0) return res;
    }

    // 2. RSC Flight Streams (self.__next_f.push) in modern Next.js
    const flightMatches = html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g);
    for (const match of flightMatches) {
      const rawChunk = match[1];
      try {
        const unescaped = JSON.parse(`"${rawChunk}"`);
        const jsonMatch = unescaped.match(/(\{.*"(?:linear_conversation|serverResponse|mapping|chat_messages)".*\})/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            const conv = parsed.serverResponse?.data || parsed;
            const res = parseChatFromJSON(conv);
            if (res.messages.length > 0) return res;
          } catch {}
        }
      } catch {}
    }

    // 3. Any script containing mapping or linear_conversation or messages
    const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of scriptMatches) {
      const scriptContent = match[1];
      if (scriptContent.includes('"linear_conversation"') || scriptContent.includes('"serverResponse"') || scriptContent.includes('"mapping"')) {
        const firstBrace = scriptContent.indexOf('{"');
        if (firstBrace !== -1) {
          const lastBrace = scriptContent.lastIndexOf("}");
          if (lastBrace > firstBrace) {
            try {
              const snippet = scriptContent.substring(firstBrace, lastBrace + 1);
              const parsed = JSON.parse(snippet);
              const res = parseChatFromJSON(parsed.serverResponse?.data || parsed);
              if (res.messages.length > 0) return res;
            } catch {}
          }
        }
      }
    }
  } catch {}
  return { messages: [], title: "Shared Chat" };
}

/**
 * Parses chat structure from raw HTML markup using DOMParser
 */
function parseFromHTMLMarkup(html: string): { messages: ChatMessage[]; title: string } {
  const messages: ChatMessage[] = [];
  let title = "HTML Chat Export";

  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove non-content elements
      doc.querySelectorAll("script, style, noscript, svg, iframe, head, nav, footer, button").forEach((el) => el.remove());

      const titleTag = doc.querySelector("title")?.textContent;
      if (titleTag && !titleTag.toLowerCase().includes("claude") && !titleTag.toLowerCase().includes("chatgpt")) {
        title = titleTag.trim();
      }

      // 1. ChatGPT article / section selector
      const chatGptTurns = doc.querySelectorAll("section[data-testid^='conversation-turn-'], article");
      if (chatGptTurns.length > 0) {
        chatGptTurns.forEach((art, idx) => {
          const isUser =
            art.getAttribute("data-turn") === "user" ||
            art.querySelector("[data-message-author-role='user']") !== null ||
            (art.querySelector("h4")?.textContent || "").toLowerCase().includes("you said");
          const role = isUser ? "user" : "assistant";
          const contentTarget = art.querySelector(".markdown, .whitespace-pre-wrap, [class*='text-message']") || art;
          const text = contentTarget.textContent?.trim() || "";
          if (text) {
            messages.push({
              id: `msg-${idx + 1}`,
              role,
              text,
            });
          }
        });
        if (messages.length > 0) return { messages, title };
      }

      // 2. Claude message selector
      const claudeTurns = doc.querySelectorAll(".font-claude-response:not(#markdown-artifact), [data-testid='user-message'], [class*='font-claude']");
      if (claudeTurns.length > 0) {
        claudeTurns.forEach((item, idx) => {
          const isUser = item.getAttribute("data-testid") === "user-message" || item.classList.contains("user-message");
          const role = isUser ? "user" : "assistant";
          const text = item.textContent?.trim() || "";
          if (text) {
            messages.push({
              id: `msg-${idx + 1}`,
              role,
              text,
            });
          }
        });
        if (messages.length > 0) return { messages, title };
      }

      // 3. Gemini message selector
      const geminiTurns = doc.querySelectorAll("user-query, model-response, message-content");
      if (geminiTurns.length > 0) {
        geminiTurns.forEach((item, idx) => {
          const tagName = item.tagName.toLowerCase();
          const role = tagName.includes("user") ? "user" : "assistant";
          const text = item.textContent?.trim() || "";
          if (text) {
            messages.push({
              id: `msg-${idx + 1}`,
              role,
              text,
            });
          }
        });
        if (messages.length > 0) return { messages, title };
      }

      // 4. General message-author-role attribute
      const messageNodes = doc.querySelectorAll(
        "[data-message-author-role], [class*='user-message'], [class*='agent-turn'], [data-testid*='conversation-turn']"
      );

      if (messageNodes.length > 0) {
        messageNodes.forEach((el, idx) => {
          const roleAttr =
            el.getAttribute("data-message-author-role") ||
            (el.className.includes("user") || el.getAttribute("data-testid")?.includes("user") ? "user" : "assistant");
          const text = el.textContent?.trim() || "";
          if (text && text.length > 1) {
            messages.push({
              id: `msg-${idx + 1}`,
              role: normalizeRole(roleAttr),
              text,
            });
          }
        });
      }
    } catch {}
  }

  return { messages, title };
}

const KNOWN_SPEAKERS = [
  "user", "human", "me", "you", "you said", "prompt", "author", "sender", "user query", "question", "q",
  "assistant", "chatgpt", "chatgpt said", "claude", "claude said", "gemini", "gemini said",
  "deepseek", "deepseek-r1", "deepseek r1", "deepseek-v3", "copilot", "microsoft copilot",
  "perplexity", "grok", "grok 2", "grok 3", "ai", "bot", "model", "model response", "response", "answer", "a",
  "system", "instructions"
];

function isSpeakerHeader(line: string): { role: ChatMessage["role"]; model?: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 50) return null;

  // Clean markdown bold, headers, parentheses
  const stripped = trimmed
    .replace(/^#{1,4}\s*/, "")
    .replace(/^[*_~]{1,3}/, "")
    .replace(/[*_~]{1,3}:?$/, "")
    .replace(/[()[\]{}]/g, "")
    .replace(/[:\s-]+$/, "")
    .trim();

  const lower = stripped.toLowerCase();

  // 1. Direct match with known speaker words
  if (KNOWN_SPEAKERS.includes(lower)) {
    return { role: normalizeRole(lower), model: undefined };
  }

  // 2. Model version variants (e.g. "Claude 3.7 Sonnet", "ChatGPT 4o", "GPT-4o", "Sonnet 3.5", "Gemini 2.0 Flash")
  if (/^(claude|chatgpt|gpt|gemini|deepseek|grok|copilot)/i.test(lower)) {
    return { role: "assistant", model: stripped };
  }

  // 3. Emojis (🧑 User, 🤖 Claude)
  if (/^(🧑|👤|🙋|👨|👩)\s*(user|you|me|human)?/i.test(trimmed)) {
    return { role: "user", model: undefined };
  }
  if (/^(🤖|🧠|⚡|✨|💻|🔮)\s*(assistant|chatgpt|claude|gemini|ai|model|deepseek)?/i.test(trimmed)) {
    return { role: "assistant", model: undefined };
  }

  return null;
}

/**
 * Parses Markdown style dialogue with headings like "### User", "### Assistant", "**User:**", etc.
 */
function parseFromMarkdownDialogue(text: string): { messages: ChatMessage[]; title: string } {
  const messages: ChatMessage[] = [];
  const lines = text.split("\n");
  let currentRole: ChatMessage["role"] | null = null;
  let currentLines: string[] = [];
  let title = "Markdown Conversation";

  const flush = () => {
    if (currentRole && currentLines.length > 0) {
      const body = currentLines.join("\n").trim();
      if (body) {
        messages.push({
          id: `msg-${messages.length + 1}`,
          role: currentRole,
          text: body,
        });
      }
      currentLines = [];
    }
  };

  const speakerKeywords = "user|prompt|human|me|you|assistant|chatgpt|claude|gemini|deepseek|copilot|grok|perplexity|ai|model|system";
  const headerRegex = new RegExp(`^#{1,4}\\s*(${speakerKeywords})[:\\s]*(.*)`, "i");
  const boldRegex = new RegExp(`^\\*\\*(${speakerKeywords})[:\\s]*\\*\\*[:\\s]*(.*)`, "i");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(headerRegex);
    const boldMatch = line.match(boldRegex);

    if (headerMatch) {
      flush();
      currentRole = normalizeRole(headerMatch[1]);
      if (headerMatch[2]?.trim()) currentLines.push(headerMatch[2].trim());
    } else if (boldMatch) {
      flush();
      currentRole = normalizeRole(boldMatch[1]);
      if (boldMatch[2]?.trim()) currentLines.push(boldMatch[2].trim());
    } else {
      if (currentRole) {
        currentLines.push(line);
      } else if (line.startsWith("# ") && !title.includes(" - ")) {
        title = line.replace(/^#\s*/, "").trim();
      }
    }
  }
  flush();

  return { messages, title };
}

/**
 * Parses line-by-line speaker dialogue:
 * Supports:
 * - "User: Hello\nClaude: Hi!"
 * - Standalone speaker lines: "User\nHello\nClaude\nHi!"
 * - "You said:\n...\nChatGPT said:\n..."
 * - Multi-model copies (e.g. Claude 3.7 Sonnet, ChatGPT 4o)
 */
function parseFromLineDialogue(text: string): { messages: ChatMessage[]; title: string } {
  const messages: ChatMessage[] = [];
  const lines = text.split("\n");
  let currentRole: ChatMessage["role"] | null = null;
  let currentModel: string | undefined = undefined;
  let currentLines: string[] = [];
  let title = "Chat Transcript";

  const flush = () => {
    if (currentRole && currentLines.length > 0) {
      const body = currentLines.join("\n").trim();
      if (body) {
        messages.push({
          id: `msg-${messages.length + 1}`,
          role: currentRole,
          text: body,
          model: currentModel,
        });
      }
      currentLines = [];
    }
  };

  const prefixRegex = /^(?:\[[\d\s:apmAPM\/-]+\]\s*)?([A-Za-z0-9\s_-]{1,30})[:\s-]+(.*)/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      if (currentRole) currentLines.push("");
      continue;
    }

    // Check A: Standalone speaker line
    const speakerMatch = isSpeakerHeader(trimmedLine);
    if (speakerMatch) {
      if (!currentRole && currentLines.length > 0) {
        const userText = currentLines.join("\n").trim();
        if (userText) {
          messages.push({
            id: `msg-${messages.length + 1}`,
            role: "user",
            text: userText,
          });
        }
        currentLines = [];
      } else {
        flush();
      }

      currentRole = speakerMatch.role;
      currentModel = speakerMatch.model;

      // Check if next line is a sub-model badge (e.g. "Sonnet 3.7", "4o mini")
      if (i + 1 < lines.length) {
        const nextTrimmed = lines[i + 1].trim();
        if (/^(sonnet|haiku|opus|4o|4o-mini|o1|o3|pro|flash|mini|r1|v3)[\d.\s\w-]*$/i.test(nextTrimmed)) {
          currentModel = currentModel ? `${currentModel} (${nextTrimmed})` : nextTrimmed;
          i++; // Skip model subtitle line
        }
      }
      continue;
    }

    // Check B: Line with speaker prefix (e.g. "User: How do I build a calculator?")
    const match = rawLine.match(prefixRegex);
    if (match) {
      const prefixCheck = isSpeakerHeader(match[1]);
      if (prefixCheck) {
        if (!currentRole && currentLines.length > 0) {
          const userText = currentLines.join("\n").trim();
          if (userText) {
            messages.push({
              id: `msg-${messages.length + 1}`,
              role: "user",
              text: userText,
            });
          }
          currentLines = [];
        } else {
          flush();
        }
        currentRole = prefixCheck.role;
        currentModel = prefixCheck.model;
        if (match[2]?.trim()) currentLines.push(match[2].trim());
        continue;
      }
    }

    // Content line
    if (currentRole) {
      currentLines.push(rawLine);
    } else {
      if (trimmedLine.startsWith("# ") && !title.includes(" - ")) {
        title = trimmedLine.replace(/^#\s*/, "").trim();
      } else if (!/^(claude|chatgpt|gemini|deepseek|grok|perplexity|toolhub|new chat|chat history|sign in|log in|share)$/i.test(trimmedLine)) {
        currentLines.push(rawLine);
      }
    }
  }
  flush();

  return { messages, title };
}

/**
 * Parses alternating paragraph blocks when no explicit speaker tags are present
 */
function parseFromAlternatingParagraphs(text: string): { messages: ChatMessage[]; title: string } {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter((b) => b.length > 0);
  if (blocks.length < 2) return { messages: [], title: "Conversation" };

  const messages: ChatMessage[] = blocks.map((block, idx) => ({
    id: `msg-${idx + 1}`,
    role: idx % 2 === 0 ? "user" : "assistant",
    text: block,
    timestamp: new Date().toISOString(),
  }));

  return {
    messages,
    title: blocks[0].slice(0, 40) + "...",
  };
}

/**
 * Normalizes varied role names into standard user | assistant | system | tool
 */
function normalizeRole(role: any): ChatMessage["role"] {
  if (!role || typeof role !== "string") return "user";
  const r = role.toLowerCase().trim();
  if (["user", "human", "me", "you", "you said", "prompt", "author", "sender", "user query", "q", "question"].includes(r)) return "user";
  if (["assistant", "chatgpt", "chatgpt said", "claude", "claude said", "gemini", "gemini said", "deepseek", "copilot", "perplexity", "grok", "ai", "bot", "model", "model response", "agent", "response", "a", "answer"].includes(r)) return "assistant";
  if (["system", "instructions", "custom instructions"].includes(r)) return "system";
  if (["tool", "function", "code interpreter"].includes(r)) return "tool";
  return "user";
}

/**
 * Extracts plain text from nested parts or array structures
 */
function extractTextFromMessage(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.text) return item.text;
        if (item?.type === "text" && item?.text) return item.text;
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  if (typeof content === "object" && content.text) {
    return String(content.text).trim();
  }
  return "";
}

/**
 * Exporter: Formatted JSON
 */
export function exportToJSON(messages: ChatMessage[], title: string = "Exported Conversation"): string {
  const exportPayload = {
    title,
    exportedAt: new Date().toISOString(),
    generator: "ToolHub Universal AI Chat Exporter",
    stats: getChatStats(messages, title),
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.text,
      timestamp: m.timestamp || new Date().toISOString(),
      model: m.model,
    })),
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Exporter: Clean GitHub Flavored Markdown (.md)
 */
export function exportToMarkdown(messages: ChatMessage[], title: string = "Exported Conversation"): string {
  const stats = getChatStats(messages, title);
  const dateStr = new Date().toLocaleDateString();

  const lines: string[] = [
    `# ${title}`,
    ``,
    `> **Exported via ToolHub** | **Date:** ${dateStr} | **Messages:** ${stats.totalMessages} | **Words:** ${stats.totalWords}`,
    ``,
    `---`,
    ``,
  ];

  messages.forEach((msg) => {
    const roleHeading = msg.role === "user" ? "### 🧑 User" : msg.role === "assistant" ? "### 🤖 Assistant" : "### ⚙️ System";
    lines.push(roleHeading);
    lines.push(``);
    lines.push(msg.text);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  });

  return lines.join("\n");
}

/**
 * Exporter: Formatted Plain Text (.txt)
 */
export function exportToPlainText(messages: ChatMessage[], title: string = "Exported Conversation"): string {
  const lines: string[] = [
    `================================================================================`,
    `TITLE: ${title.toUpperCase()}`,
    `EXPORT DATE: ${new Date().toLocaleString()}`,
    `TOTAL MESSAGES: ${messages.length}`,
    `================================================================================`,
    ``,
  ];

  messages.forEach((msg, idx) => {
    const roleLabel = msg.role === "user" ? "USER" : msg.role === "assistant" ? "ASSISTANT (AI)" : "SYSTEM";
    lines.push(`[MESSAGE #${idx + 1} - ${roleLabel}]`);
    lines.push(msg.text);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(``);
  });

  return lines.join("\n");
}

/**
 * Exporter: Spreadsheet CSV (.csv)
 */
export function exportToCSV(messages: ChatMessage[]): string {
  const escapeCsv = (str: string) => `"${(str || "").replace(/"/g, '""')}"`;
  const headers = ["Index", "Role", "Message Text", "Timestamp"];
  const rows = messages.map((m, idx) => [
    idx + 1,
    m.role,
    escapeCsv(m.text),
    escapeCsv(m.timestamp || new Date().toISOString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Exporter: Standalone Self-Contained HTML Document (.html)
 */
export function exportToHTML(messages: ChatMessage[], title: string = "Exported Conversation"): string {
  const stats = getChatStats(messages, title);
  const escapeHtml = (unsafe: string) =>
    (unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const messageItemsHtml = messages
    .map((msg) => {
      const isUser = msg.role === "user";
      return `
        <div class="message ${isUser ? "user" : "assistant"}">
          <div class="header">
            <span class="role">${isUser ? "User" : "Assistant (AI)"}</span>
          </div>
          <div class="body">${escapeHtml(msg.text).replace(/\n/g, "<br/>")}</div>
        </div>
      `;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --user-bg: #eff6ff;
      --user-border: #bfdbfe;
      --primary: #1e4fd8;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #090d16;
        --card-bg: #111827;
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: #1e293b;
        --user-bg: #1e293b;
        --user-border: #334155;
        --primary: #3b82f6;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
      margin: 0;
    }
    .container {
      max-width: 780px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }
    .meta {
      font-size: 0.85rem;
      color: var(--muted);
    }
    .message {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .message.user {
      background: var(--user-bg);
      border-color: var(--user-border);
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .role {
      color: var(--primary);
    }
    .body {
      font-size: 0.95rem;
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">Exported via ToolHub | Messages: ${stats.totalMessages} | Words: ${stats.totalWords}</div>
    </header>
    <main>
      ${messageItemsHtml}
    </main>
  </div>
</body>
</html>`;
}

/**
 * Exporter: Clean Paginated PDF Document (.pdf) using jsPDF
 */
export async function exportToPDF(messages: ChatMessage[], title: string = "Exported Conversation"): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = 24;

  // Title Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 79, 216); // ToolHub Primary Blue
  const splitTitle = doc.splitTextToSize(title, maxLineWidth);
  doc.text(splitTitle, margin, cursorY);
  cursorY += splitTitle.length * 8 + 4;

  // Subtitle / Meta Bar
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Exported via ToolHub | Date: ${new Date().toLocaleDateString()} | Total Messages: ${messages.length}`,
    margin,
    cursorY
  );
  cursorY += 6;

  // Divider line
  doc.setDrawColor(220, 225, 230);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 10;

  // Render Messages
  messages.forEach((msg, idx) => {
    const isUser = msg.role === "user";

    // Check page overflow for role header
    if (cursorY > pageHeight - 30) {
      doc.addPage();
      cursorY = 20;
    }

    // Role Badge & Label
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    if (isUser) {
      doc.setTextColor(30, 79, 216);
      doc.text(`[USER] Message #${idx + 1}`, margin, cursorY);
    } else {
      doc.setTextColor(16, 149, 106); // Emerald Assistant
      doc.text(`[ASSISTANT] Message #${idx + 1}`, margin, cursorY);
    }
    cursorY += 6;

    // Message Body
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 45, 55);

    const splitBody = doc.splitTextToSize(msg.text, maxLineWidth - 4);
    for (let i = 0; i < splitBody.length; i++) {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(splitBody[i], margin + 2, cursorY);
      cursorY += 5;
    }

    cursorY += 6;

    // Message separator line
    if (cursorY < pageHeight - 20) {
      doc.setDrawColor(240, 242, 245);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;
    }
  });

  const sanitizedFilename = title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40);
  doc.save(`${sanitizedFilename || "ai_conversation"}.pdf`);
}

/**
 * Calculates Token, Word, and Message statistics
 */
export function getChatStats(messages: ChatMessage[], title: string = "Conversation"): ChatExportMetadata {
  let totalWords = 0;

  messages.forEach((m) => {
    const words = m.text.trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
  });

  const estimatedTokens = Math.round(totalWords * 1.33);

  return {
    title,
    source: "ToolHub Universal Parser",
    createdAt: new Date().toISOString(),
    totalMessages: messages.length,
    totalWords,
    estimatedTokens,
  };
}
