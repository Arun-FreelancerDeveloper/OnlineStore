import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.BASE_URL}/category`;

  getCategory(groupId: number): Observable<Category[]> {
    return this.http
      .get<ApiResponse<any[]>>(this.apiUrl + '/' + groupId)
      .pipe(
        map(res =>
          res.data.map(item => ({
           categoryid: item.categoryid,
           categoryname: item.categoryname
          }))
        ),
        shareReplay(1)
      );
  }
}
