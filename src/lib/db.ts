import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = (typeof import.meta.env !== "undefined" && import.meta.env ? import.meta.env.DATABASE_URL : undefined) || process.env.DATABASE_URL || "";

export const sql = databaseUrl ? neon(databaseUrl) : null;
export const db = sql ? drizzle(sql, { schema }) : null;
export type DbClient = typeof db;
