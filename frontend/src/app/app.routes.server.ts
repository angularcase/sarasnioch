import { RenderMode, ServerRoute } from '@angular/ssr';

async function getCategorySlugs(): Promise<Array<{ categorySlug: string }>> {
  try {
    // Try to fetch categories from Strapi API
    const response = await fetch('http://localhost:1337/api/animal-categories?fields[0]=slug');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.map((category: { slug: string }) => ({
      categorySlug: category.slug
    }));
  } catch (error) {
    console.warn('Could not fetch animal categories for prerender, using fallback:', error);
    // Fallback: return empty array or predefined slugs if API is not available during build
    // You can customize this fallback list based on your known categories
    return [];
  }
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'artykuly/:categorySlug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getCategorySlugs
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
