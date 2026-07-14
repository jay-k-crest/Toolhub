import { db } from "./db";
import { categories, tools } from "./schema";
import { categoriesFallback, toolsFallback } from "../content/tools-static-fallback";

async function main() {
  if (!db) {
    console.error("No DATABASE_URL configured. Please check your environment variables.");
    return;
  }

  console.log("Starting seed database...");

  try {
    for (const cat of categoriesFallback) {
      console.log(`Upserting category: ${cat.name}`);
      await db.insert(categories).values({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
      }).onConflictDoUpdate({
        target: categories.id,
        set: {
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          displayOrder: cat.displayOrder,
        }
      });
    }

    const dbCats = await db.select().from(categories);
    const catSlugToId = new Map(dbCats.map((c) => [c.slug, c.id]));

    for (const tool of toolsFallback) {
      const categoryId = catSlugToId.get(tool.categorySlug) || null;
      console.log(`Upserting tool: ${tool.name}`);
      await db.insert(tools).values({
        slug: tool.slug,
        name: tool.name,
        categoryId,
        shortDesc: tool.shortDesc,
        metaTitle: tool.metaTitle,
        metaDescription: tool.metaDescription,
        introContent: tool.introContent,
        faq: tool.faq,
        displayOrder: tool.displayOrder,
      }).onConflictDoUpdate({
        target: tools.slug,
        set: {
          name: tool.name,
          categoryId,
          shortDesc: tool.shortDesc,
          metaTitle: tool.metaTitle,
          metaDescription: tool.metaDescription,
          introContent: tool.introContent,
          faq: tool.faq,
          displayOrder: tool.displayOrder,
        }
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main().catch((err) => {
  console.error("Seeding command failure:", err);
  process.exit(1);
});
