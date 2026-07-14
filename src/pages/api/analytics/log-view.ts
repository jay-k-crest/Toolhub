import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { pageViews } from "../../../lib/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const { request, clientAddress } = context;
    const body = await request.json();
    const { pathname } = body;

    if (!pathname) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ignore admin and api paths
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return new Response(
        JSON.stringify({ success: true, message: "Internal route ignored" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate stable visitor ID by hashing client IP + User-Agent (GDPR/privacy-safe)
    const clientIp = request.headers.get("x-forwarded-for") || clientAddress || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const visitorId = crypto
      .createHash("sha256")
      .update(`${clientIp}-${userAgent}`)
      .digest("hex");

    let isNewVisitor = true;

    if (db) {
      // Check if visitor has any previous views
      const existing = await db
        .select({ id: pageViews.id })
        .from(pageViews)
        .where(eq(pageViews.visitorId, visitorId))
        .limit(1);

      if (existing.length > 0) {
        isNewVisitor = false;
      }

      await db.insert(pageViews).values({
        visitorId,
        pathname,
        isNewVisitor,
      });
      console.log(`Page view logged: ${pathname} (Visitor: ${visitorId.substring(0, 8)}, New: ${isNewVisitor})`);
    } else {
      console.log("Database not configured. Logged page view:", { visitorId, pathname, isNewVisitor });
    }

    return new Response(
      JSON.stringify({ success: true, visitorId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API log-view error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
