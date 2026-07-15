import { db } from "./db";
import { categories as dbCategories, tools as dbTools } from "./schema";
import { categoriesFallback, toolsFallback, type CategoryFallback, type ToolFallback } from "../content/tools-static-fallback";
import { eq } from "drizzle-orm";

const toolsFallbackBySlug = new Map(toolsFallback.map((tool) => [tool.slug, tool] as const));

function mergeToolWithFallback<T extends {
  id?: number;
  slug: string;
  name: string;
  categoryId: number | null;
  categorySlug: string;
  shortDesc?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  introContent?: string | null;
  faq?: ToolFallback["faq"] | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
}>(tool: T): ToolWithActive {
  const fallback = toolsFallbackBySlug.get(tool.slug);
  return {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    categoryId: tool.categoryId,
    categorySlug: fallback?.categorySlug || tool.categorySlug,
    shortDesc: tool.shortDesc?.trim() || fallback?.shortDesc || "",
    metaTitle: tool.metaTitle?.trim() || fallback?.metaTitle || tool.name,
    metaDescription: tool.metaDescription?.trim() || fallback?.metaDescription || tool.shortDesc?.trim() || fallback?.shortDesc || "",
    introContent: tool.introContent?.trim() || fallback?.introContent || "",
    faq: tool.faq && tool.faq.length > 0 ? tool.faq : fallback?.faq || [],
    isActive: tool.isActive ?? true,
    displayOrder: tool.displayOrder ?? fallback?.displayOrder ?? 0,
  };
}

export interface Category extends CategoryFallback {}
export interface Tool {
  id?: number;
  slug: string;
  name: string;
  categoryId: number | null;
  categorySlug: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  introContent: string;
  faq: ToolFallback["faq"];
  displayOrder: number;
}

export type ToolWithActive = Tool & {
  isActive: boolean;
};

let cachedCategories: Category[] | null = null;
let cachedTools: ToolWithActive[] | null = null;

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

export async function getTools(): Promise<ToolWithActive[]> {
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
        cachedTools = results.map((r) => {
          const fallback = toolsFallbackBySlug.get(r.slug);
          const categorySlug = r.categoryId ? (catIdToSlug.get(r.categoryId) || fallback?.categorySlug || "finance") : (fallback?.categorySlug || "finance");
          return mergeToolWithFallback({
            id: r.id,
            slug: r.slug,
            name: r.name,
            categoryId: r.categoryId,
            categorySlug,
            shortDesc: r.shortDesc,
            metaTitle: r.metaTitle,
            metaDescription: r.metaDescription,
            introContent: r.introContent,
            faq: r.faq,
            isActive: r.isActive,
            displayOrder: r.displayOrder,
          });
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
    } as ToolWithActive;
  });
  return cachedTools;
}

export async function getToolBySlug(slug: string): Promise<ToolWithActive | null> {
  const tools = await getTools();
  return tools.find(t => t.slug === slug && t.isActive) || null;
}

export async function getToolsByCategory(categorySlug: string): Promise<ToolWithActive[]> {
  const tools = await getTools();
  return tools.filter(t => t.categorySlug === categorySlug && t.isActive);
}
