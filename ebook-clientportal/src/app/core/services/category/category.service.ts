import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiPaginationResponse } from '../../models/api-response/api-response.model';
import { CategoryModel } from '../../models/category/category.model';
import { ConfigService } from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl: string;

  // ===== CACHE =====
  private cache = new Map<string, Observable<CategoryModel[]>>();

  constructor() {
    this.apiUrl = `${this.config.api.baseUrl}/category`;
  }

  // =====================================================
  // GET CATEGORY GROUPS
  // =====================================================
  getCategoryGroups(
    groupId: number,
    page: number = 1,
    limit: number = 10
  ): Observable<CategoryModel[]> {
    const key = `${groupId}-${page}-${limit}`;

    // ✅ Return cached request if exists
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // ✅ Build query params (clean approach)
    const params = new HttpParams()
      .set('groupId', groupId)
      .set('page', page)
      .set('pageSize', limit);

    const request$ = this.http
      .get<ApiPaginationResponse<CategoryModel>>(this.apiUrl, { params })
      .pipe(
        map(res => res.data.data), // extract actual array
        shareReplay(1) // cache response
      );

    // ✅ Store in cache
    this.cache.set(key, request$);

    return request$;
  }

  // =====================================================
  // CLEAR CACHE (optional utility)
  // =====================================================
  clearCache(): void {
    this.cache.clear();
  }
}
