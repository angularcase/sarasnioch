import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnimalCategory } from './animal-category.service';

export interface Manufacturer {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  website?: string;
}

export interface ProductImage {
  url: string;
}

export interface Leaflet {
  id: number;
  file: { url: string; name: string; mime: string };
  caption: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: unknown;
  manufacturer?: Manufacturer;
  animalCategories?: AnimalCategory[];
  gallery?: ProductImage[];
  leaflets?: Leaflet[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
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
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:1337/api/products';

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl, {
      params: {
        'sort': 'name:asc',
        'populate': '*'
      }
    }).pipe(
      map((response) => {
        if (response.data?.length) {
          response.data = response.data.map((item) =>
            this.flattenStrapiDocument(item as unknown as Record<string, unknown>)
          ) as unknown as Product[];
        }
        return response;
      })
    );
  }

  getProductBySlug(slug: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.apiUrl}?filters[slug][$eq]=${slug}&populate[0]=animalCategories&populate[1]=manufacturer&populate[2]=gallery&populate[3]=leaflets&populate[4]=leaflets.file`
    ).pipe(
      map((response) => {
        if (response.data?.length) {
          response.data = response.data.map((item) =>
            this.flattenStrapiDocument(item as unknown as Record<string, unknown>)
          ) as unknown as Product[];
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

    const flattenMedia = (media: unknown): ProductImage[] => {
      let arr: unknown[];
      const m = media as { data?: unknown } | undefined;
      if (Array.isArray(media)) {
        arr = media;
      } else if (m?.data) {
        arr = Array.isArray(m.data) ? m.data : [m.data];
      } else {
        return [];
      }
      return arr
        .map((item) => {
          const rec = item as Record<string, unknown>;
          // Check if url is directly in the object (already flattened)
          const directUrl = rec['url'] as string | undefined;
          if (directUrl) {
            const url = directUrl.startsWith('http') 
              ? directUrl 
              : `${this.apiUrl.replace('/api/products', '')}${directUrl}`;
            return { url };
          }
          // Check if url is in attributes (not yet flattened)
          const attrs = rec['attributes'] as { url?: string } | undefined;
          if (attrs?.url) {
            const url = attrs.url.startsWith('http') 
              ? attrs.url 
              : `${this.apiUrl.replace('/api/products', '')}${attrs.url}`;
            return { url };
          }
          return null;
        })
        .filter((item): item is ProductImage => item !== null);
    };

    const flattenLeaflets = (leaflets: unknown): Leaflet[] => {
      if (!leaflets) {
        return [];
      }
      
      let arr: unknown[];
      // Components can come as array directly or wrapped in data
      if (Array.isArray(leaflets)) {
        arr = leaflets;
      } else {
        const l = leaflets as { data?: unknown } | undefined;
        if (l?.data) {
          arr = Array.isArray(l.data) ? l.data : [l.data];
        } else {
          return [];
        }
      }

      return arr
        .map((item) => {
          const rec = item as Record<string, unknown>;
          
          // Get caption (string field)
          const caption = (rec['caption'] as string | undefined) || '';
          
          // Get file (media field)
          let fileData: Record<string, unknown> | null = null;
          const file = rec['file'];
          
          if (file) {
            // File might be wrapped in { data: {...} }
            const fileObj = file as { data?: unknown } | Record<string, unknown>;
            if (fileObj['data']) {
              fileData = fileObj['data'] as Record<string, unknown>;
            } else if (typeof file === 'object' && file !== null) {
              fileData = file as Record<string, unknown>;
            }
          }
          
          if (!fileData) {
            return null;
          }
          
          // Flatten file attributes
          const fileAttrs = fileData['attributes'] as Record<string, unknown> | undefined;
          const flatFile = fileAttrs ? { ...fileData, ...fileAttrs } : fileData;
          delete flatFile['attributes'];
          
          // Get file URL
          const fileUrl = flatFile['url'] as string | undefined;
          if (!fileUrl) {
            return null;
          }
          
          const url = fileUrl.startsWith('http') 
            ? fileUrl 
            : `${this.apiUrl.replace('/api/products', '')}${fileUrl}`;
          
          const name = (flatFile['name'] as string | undefined) || '';
          const mime = (flatFile['mime'] as string | undefined) || '';
          
          return {
            id: (rec['id'] as number | undefined) || 0,
            file: { url, name, mime },
            caption
          };
        })
        .filter((item): item is Leaflet => item !== null);
    };

    const ac = flat['animalCategories'];
    if (ac) flat['animalCategories'] = flattenRelation(ac);
    
    // Flatten manufacturer (manyToOne relation - single object, not array)
    const man = flat['manufacturer'];
    if (man) {
      let manData: Record<string, unknown> | null = null;
      
      // Check if manufacturer is wrapped in { data: {...} }
      const manObj = man as { data?: unknown } | Record<string, unknown>;
      if (manObj['data']) {
        manData = manObj['data'] as Record<string, unknown>;
      } else if (typeof man === 'object' && man !== null) {
        manData = man as Record<string, unknown>;
      }
      
      if (manData) {
        const manAttrs = manData['attributes'] as Record<string, unknown> | undefined;
        if (manAttrs) {
          // Manufacturer has attributes to flatten
          const flattened: Record<string, unknown> = { ...manData, ...manAttrs };
          delete flattened['attributes'];
          flat['manufacturer'] = flattened;
        } else {
          // Manufacturer is already flat
          flat['manufacturer'] = manData;
        }
      } else {
        flat['manufacturer'] = null;
      }
    }
    
    const gallery = flat['gallery'];
    if (gallery) {
      flat['gallery'] = flattenMedia(gallery);
    }
    
    const leaflets = flat['leaflets'];
    if (leaflets) {
      flat['leaflets'] = flattenLeaflets(leaflets);
    }
    
    return flat;
  }
}
