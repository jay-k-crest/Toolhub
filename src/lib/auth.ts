import crypto from "node:crypto";

const ADMIN_PASSWORD = (typeof import.meta.env !== "undefined" && import.meta.env ? import.meta.env.ADMIN_PASSWORD : undefined) || process.env.ADMIN_PASSWORD || "admin123";

// We'll use a session identifier (e.g., "admin-session") signed with the password.
// Alternatively, we can use the password hash or a static string signed by a secret.
const SECRET_KEY = (typeof import.meta.env !== "undefined" && import.meta.env ? import.meta.env.JWT_SECRET : undefined) || process.env.JWT_SECRET || ADMIN_PASSWORD;

export function signSession(): string {
  const payload = JSON.stringify({
    role: "admin",
    createdAt: Date.now(),
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(encodedPayload);
  const signature = hmac.digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;
  const [encodedPayload, signature] = parts;

  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(encodedPayload);
  const expectedSignature = hmac.digest("base64url");
  
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    // Expiry: 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.createdAt > sevenDaysMs) {
      return false;
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
