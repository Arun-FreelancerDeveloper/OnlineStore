import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiPaginationResponse } from '../../models/api-response/api-response.model';
import { CategoryGroupModel } from '../../models/categorygroup/category-group.model';
import { ConfigService } from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryGroupService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CACHE =====
  private cache = new Map<string, Observable<CategoryGroupModel[]>>();

  constructor() {
    // ✅ Correct way to access config
    this.apiUrl = `${this.config.api.baseUrl}/categorygroup`;
  }

  // =====================================================
  // GET CATEGORY GROUPS
  // =====================================================
  getCategoryGroups(page: number = 1, limit: number = 10): Observable<CategoryGroupModel[]> {

    const key = `${page}-${limit}`;

    if (!this.cache.has(key)) {

      const request$ = this.http
        .get<ApiPaginationResponse<CategoryGroupModel>>(
          `${this.apiUrl}?page=${page}&pageSize=${limit}`
        )
        .pipe(
          map(res => res.data.data),
          shareReplay(1)
        );

      this.cache.set(key, request$);
    }

    return this.cache.get(key)!;
  }
}
