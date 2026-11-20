import type { APIRoute } from "astro";

export const prerender = false;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,application/json,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new Response(JSON.stringify({ error: "Invalid protocol" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Special handler: If ChatGPT share URL, first attempt to fetch the backend share API
    const chatGptShareMatch = targetUrl.match(/(?:chatgpt\.com|chat\.openai\.com)\/share\/([a-zA-Z0-9_-]+)/);
    if (chatGptShareMatch && chatGptShareMatch[1]) {
      const shareId = chatGptShareMatch[1];
      const apiCandidates = [
        `https://chatgpt.com/backend-api/share/${shareId}`,
        `https://chat.openai.com/backend-anon/share/${shareId}`,
      ];

      for (const apiUrl of apiCandidates) {
        try {
          const apiRes = await fetch(apiUrl, {
            headers: {
              "User-Agent": BROWSER_HEADERS["User-Agent"],
              Accept: "application/json",
            },
          });
          if (apiRes.ok) {
            const apiText = await apiRes.text();
            if (apiText && (apiText.includes('"mapping"') || apiText.includes('"linear_conversation"') || apiText.includes('"title"'))) {
              return new Response(JSON.stringify({ content: apiText }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          }
        } catch {
          // Fall back to main page fetch
        }
      }
    }

    // Special handler: If Claude share URL, attempt to fetch chat snapshot API
    const claudeShareMatch = targetUrl.match(/claude\.ai\/share\/([a-zA-Z0-9_-]+)/);
    if (claudeShareMatch && claudeShareMatch[1]) {
      const shareId = claudeShareMatch[1];
      const apiCandidates = [
        `https://claude.ai/api/chat_snapshots/${shareId}?rendering_mode=messages&render_all_tools=true&renders_source_card=true&renders_tally_table_bars=true`,
        `https://claude.ai/api/chat_snapshots/${shareId}`,
      ];

      for (const apiUrl of apiCandidates) {
        try {
          const apiRes = await fetch(apiUrl, {
            headers: BROWSER_HEADERS,
          });
          if (apiRes.ok) {
            const apiText = await apiRes.text();
            if (apiText && (apiText.includes('"chat_messages"') || apiText.includes('"snapshot_name"') || apiText.includes('"conversation_uuid"'))) {
              return new Response(JSON.stringify({ content: apiText }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          }
        } catch {
          // Fall back to main page fetch
        }
      }
    }

    const response = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream error: HTTP ${response.status}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = await response.text();
    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to fetch link" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
