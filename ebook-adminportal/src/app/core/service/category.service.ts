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

  getCategories(groupId: number): Observable<Category[]> {
    const url = `${this.apiUrl}?groupId=${groupId}`;
    return this.http
      .get<ApiResponse<{ data: any[] }>>(url)
      .pipe(
        map(res =>
          (res.data?.data || []).map(item => ({
            categoryid: item.categoryid,
            categoryname: item.categoryname
          }))
        ),
        shareReplay(1)
      );
  }

  getCategoryById(categoryId: number): Observable<Category> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/${categoryId}`)
      .pipe(
        map(res => ({
          categoryid: res.data.categoryid,
          categoryname: res.data.categoryname
        }))
      );
  }

  createCategory(payload: {
    groupId: number;
    categoryName: string;
    createdBy: number;
    image?: File;
  }): Observable<ApiResponse<Category>> {
    const formData = new FormData();
    formData.append('groupid', payload.groupId.toString());
    formData.append('categoryname', payload.categoryName);
    formData.append('createdby', payload.createdBy.toString());

    if (payload.image) {
      formData.append('image', payload.image);
    }

    return this.http.post<ApiResponse<Category>>(this.apiUrl, formData);
  }

  updateCategory(
    categoryId: number,
    payload: {
      categoryName: string;
      modifiedBy: number;
      image?: File;
    }
  ): Observable<ApiResponse<Category>> {
    const formData = new FormData();
    formData.append('categoryname', payload.categoryName);
    formData.append('modifiedby', payload.modifiedBy.toString());

    if (payload.image) {
      formData.append('image', payload.image);
    }

    return this.http.put<ApiResponse<Category>>(
      `${this.apiUrl}/${categoryId}`,
      formData
    );
  }

  deleteCategory(
    categoryId: number,
    deletedBy: number
  ): Observable<ApiResponse<null>> {
    return this.http.request<ApiResponse<null>>(
      'DELETE',
      `${this.apiUrl}/${categoryId}`,
      {
        body: { deletedBy }
      }
    );
  }
}
