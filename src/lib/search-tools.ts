export interface SearchToolItem {
  name: string;
  slug: string;
  categorySlug: string;
  shortDesc: string;
}

const toolsCache = new Map<string, Promise<SearchToolItem[]>>();

export function loadSearchTools(toolsUrl: string): Promise<SearchToolItem[]> {
  const existing = toolsCache.get(toolsUrl);
  if (existing) {
    return existing;
  }

  const request = fetch(toolsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load search index from ${toolsUrl}`);
      }

      return response.json() as Promise<SearchToolItem[]>;
    })
    .then((tools) => tools)
    .catch((error) => {
      toolsCache.delete(toolsUrl);
      throw error;
    });

  toolsCache.set(toolsUrl, request);
  return request;
}