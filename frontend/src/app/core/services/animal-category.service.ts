import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AnimalCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalCategoriesResponse {
  data: AnimalCategory[];
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
export class AnimalCategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/animal-categories`;

  getAnimalCategories(): Observable<AnimalCategoriesResponse> {
    return this.http.get<AnimalCategoriesResponse>(this.apiUrl, {
      params: {
        'sort': 'name:asc'
      }
    });
  }
}
