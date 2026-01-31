import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    publishedAt: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
  };
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
    return this.http.get<ArticlesResponse>(this.apiUrl, {
      params: {
        'populate': '*'
      }
    });
  }

  getArticleBySlug(slug: string): Observable<{ data: Article }> {
    return this.http.get<{ data: Article }>(`${this.apiUrl}?filters[slug][$eq]=${slug}&populate=*`);
  }
}
