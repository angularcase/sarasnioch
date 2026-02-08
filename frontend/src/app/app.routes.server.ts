import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from '../environments/environment';

async function getCategorySlugs(): Promise<Array<{ categorySlug: string }>> {
  try {
    const response = await fetch(`${environment.apiUrl}/animal-categories?fields[0]=slug`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.map((category: { slug: string }) => ({
      categorySlug: category.slug
    }));
  } catch (error) {
    console.warn('Could not fetch animal categories for prerender:', error);
    return [];
  }
}

async function getArticleSlugs(): Promise<Array<{ slug: string }>> {
  try {
    const response = await fetch(`${environment.apiUrl}/articles?fields[0]=slug`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.map((article: { slug: string }) => ({
      slug: article.slug
    }));
  } catch (error) {
    console.warn('Could not fetch articles for prerender:', error);
    return [];
  }
}

async function getProductSlugs(): Promise<Array<{ slug: string }>> {
  try {
    const response = await fetch(`${environment.apiUrl}/products?fields[0]=slug`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.map((product: { slug: string }) => ({
      slug: product.slug
    }));
  } catch (error) {
    console.warn('Could not fetch products for prerender:', error);
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
    path: 'produkty/:categorySlug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getCategorySlugs
  },
  {
    path: 'artykul/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getArticleSlugs
  },
  {
    path: 'produkt/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getProductSlugs
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
