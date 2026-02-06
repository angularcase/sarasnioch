import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Manufacturer {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturersResponse {
  data: Manufacturer[];
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
export class ManufacturerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:1337/api/manufacturers';

  getManufacturers(): Observable<ManufacturersResponse> {
    return this.http.get<ManufacturersResponse>(this.apiUrl, {
      params: {
        'sort': 'name:asc'
      }
    });
  }
}
