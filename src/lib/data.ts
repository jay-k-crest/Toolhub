import { db } from "./db";
import { categories as dbCategories, tools as dbTools } from "./schema";
import { categoriesFallback, toolsFallback, type CategoryFallback, type ToolFallback } from "../content/tools-static-fallback";
import { eq } from "drizzle-orm";

export interface Category extends CategoryFallback {}
export interface Tool extends Omit<ToolFallback, "categorySlug"> {
  id?: number;
  categoryId: number | null;
  categorySlug: string;
}

let cachedCategories: Category[] | null = null;
let cachedTools: Tool[] | null = null;

export function clearCache() {
  cachedCategories = null;
  cachedTools = null;
}

export async function getCategories(): Promise<Category[]> {
  if (cachedCategories) {
    return cachedCategories;
  }

  if (db) {
    try {
      const results = await db.select().from(dbCategories);
      if (results.length > 0) {
        cachedCategories = results.map(r => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          description: r.description || "",
          icon: r.icon || "Calculator",
          displayOrder: r.displayOrder || 0,
        })).sort((a, b) => a.displayOrder - b.displayOrder);
        return cachedCategories;
      }
    } catch (e) {
      console.warn("Database failed to load categories, using fallback:", e);
    }
  }
  cachedCategories = categoriesFallback;
  return cachedCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find(c => c.slug === slug) || null;
}

export async function getTools(): Promise<Tool[]> {
  if (cachedTools) {
    return cachedTools;
  }

  const categories = await getCategories();
  const catIdToSlug = new Map(categories.map(c => [c.id, c.slug]));
  const catSlugToId = new Map(categories.map(c => [c.slug, c.id]));

  if (db) {
    try {
      const results = await db.select().from(dbTools);
      if (results.length > 0) {
        cachedTools = results.map(r => {
          const categorySlug = r.categoryId ? (catIdToSlug.get(r.categoryId) || "finance") : "finance";
          return {
            id: r.id,
            slug: r.slug,
            name: r.name,
            categoryId: r.categoryId,
            categorySlug,
            shortDesc: r.shortDesc || "",
            metaTitle: r.metaTitle || r.name,
            metaDescription: r.metaDescription || "",
            introContent: r.introContent || "",
            faq: r.faq || [],
            isActive: r.isActive ?? true,
            displayOrder: r.displayOrder || 0,
          };
        }).sort((a, b) => a.displayOrder - b.displayOrder);
        return cachedTools;
      }
    } catch (e) {
      console.warn("Database failed to load tools, using fallback:", e);
    }
  }

  // Fallback map
  cachedTools = toolsFallback.map((t, idx) => {
    const cat = categories.find(c => c.slug === t.categorySlug);
    const categoryId = cat ? cat.id : 1;
    return {
      id: idx + 1,
      slug: t.slug,
      name: t.name,
      categoryId,
      categorySlug: t.categorySlug,
      shortDesc: t.shortDesc,
      metaTitle: t.metaTitle,
      metaDescription: t.metaDescription,
      introContent: t.introContent,
      faq: t.faq,
      isActive: true,
      displayOrder: t.displayOrder,
    };
  });
  return cachedTools;
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const tools = await getTools();
  return tools.find(t => t.slug === slug && t.isActive) || null;
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  const tools = await getTools();
  return tools.filter(t => t.categorySlug === categorySlug && t.isActive);
}
