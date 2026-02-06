import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AnimalCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Manufacturer {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  manufacturer?: Manufacturer;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  animalCategories?: AnimalCategory[];
  products?: Product[];
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:1337/api/articles';

  getArticles(): Observable<ArticlesResponse> {
    // Use populate=* to get all relations, then filter client-side
    // This avoids Strapi v4 nested populate syntax issues
    return this.http.get<ArticlesResponse>(this.apiUrl, {
      params: {
        'populate': '*'
      }
    });
  }

  getArticleBySlug(slug: string): Observable<ArticlesResponse> {
    return this.http.get<ArticlesResponse>(
      `${this.apiUrl}?filters[slug][$eq]=${slug}&populate[0]=animalCategories&populate[1]=products`
    ).pipe(
      map((response) => {
        if (response.data?.length) {
          response.data = response.data.map((item) =>
          this.flattenStrapiDocument(item as unknown as Record<string, unknown>)
        ) as unknown as Article[];
        }
        return response;
      })
    );
  }

  private flattenStrapiDocument(doc: Record<string, unknown>): Record<string, unknown> {
    const attrs = doc['attributes'] as Record<string, unknown> | undefined;
    const flat: Record<string, unknown> = attrs ? { ...doc, ...attrs } : { ...doc };
    delete flat['attributes'];

    const flattenRelation = (rel: unknown): unknown[] => {
      let arr: unknown[];
      const r = rel as { data?: unknown } | undefined;
      if (Array.isArray(rel)) {
        arr = rel;
      } else if (r?.data) {
        arr = Array.isArray(r.data) ? r.data : [r.data];
      } else {
        return [];
      }
      return arr.map((item) => {
        const rec = item as Record<string, unknown>;
        const a = rec['attributes'] as Record<string, unknown> | undefined;
        return a ? { ...rec, ...a, attributes: undefined } : rec;
      });
    };

    const ac = flat['animalCategories'];
    if (ac) flat['animalCategories'] = flattenRelation(ac);
    const prod = flat['products'];
    if (prod) flat['products'] = flattenRelation(prod);
    return flat;
  }
}
