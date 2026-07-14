import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // lucide icon name
  displayOrder: integer("display_order").default(0),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  shortDesc: text("short_desc"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  introContent: text("intro_content"), // markdown rendered above calculator
  faq: jsonb("faq").$type<Array<{ q: string; a: string }>>().default([]),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});
