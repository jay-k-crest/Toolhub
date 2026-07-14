import { defineMiddleware } from "astro:middleware";
import { verifySession } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Protect all /admin routes except for /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = context.cookies.get("admin-session")?.value;
    const isValid = verifySession(sessionCookie);

    if (!isValid) {
      return context.redirect("/admin/login/");
    }
  }

  // Protect API admin routes
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    const sessionCookie = context.cookies.get("admin-session")?.value;
    const isValid = verifySession(sessionCookie);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return next();
});
