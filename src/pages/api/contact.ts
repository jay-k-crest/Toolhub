import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { contactSubmissions } from "../../lib/schema";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (db) {
      await db.insert(contactSubmissions).values({
        name,
        email,
        message,
      });
      console.log("Contact form submission saved to database.");
    } else {
      console.log("Database not configured. Logged submission:", { name, email, message });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API contact error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
