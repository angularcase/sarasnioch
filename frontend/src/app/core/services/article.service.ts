import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<ArticlesResponse>(`${this.apiUrl}?filters[slug][$eq]=${slug}&populate=*`);
  }
}
