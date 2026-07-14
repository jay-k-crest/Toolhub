import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { toolExecutions } from "../../../lib/schema";
import crypto from "crypto";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const { request, clientAddress } = context;
    const body = await request.json();
    const { toolSlug } = body;

    if (!toolSlug) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate stable visitor ID by hashing client IP + User-Agent (GDPR/privacy-safe)
    const clientIp = request.headers.get("x-forwarded-for") || clientAddress || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const visitorId = crypto
      .createHash("sha256")
      .update(`${clientIp}-${userAgent}`)
      .digest("hex");

    if (db) {
      await db.insert(toolExecutions).values({
        toolSlug,
        visitorId,
      });
      console.log(`Tool run logged: ${toolSlug} (Visitor: ${visitorId.substring(0, 8)})`);
    } else {
      console.log("Database not configured. Logged tool run:", { toolSlug, visitorId });
    }

    return new Response(
      JSON.stringify({ success: true, visitorId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API log-run error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
