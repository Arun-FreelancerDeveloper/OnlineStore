import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CategoryGroup } from '../models/categorygroup.model';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.BASE_URL}/categorygroup`;

  /* ----------------------------------
   * GET ALL CATEGORY GROUPS
   * ---------------------------------- */
  getAllCategoryGroups(
    page = 1,
    pageSize = 10,
    findWhat = ''
  ): Observable<{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: CategoryGroup[];
  }> {
    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      findWhat
    });

    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}?${query.toString()}`)
      .pipe(
        map(res => {
          const payload = res.data ?? {};
          const groups = Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];

          return {
            currentPage: payload.currentPage ?? page,
            pageSize: payload.pageSize ?? pageSize,
            totalPages: payload.totalPages ?? 0,
            totalRecords: payload.totalRecords ?? groups.length,
            data: groups.map((item: any) => ({
              groupid: item.groupid,
              groupname: item.groupname,
              imagepath: item.imagepath
            }))
          };
        })
      );
  }

  getCategoryGroups(
    page = 1,
    pageSize = 10,
    findWhat = ''
  ): Observable<CategoryGroup[]> {
    return this.getAllCategoryGroups(page, pageSize, findWhat).pipe(
      map(res => res.data)
    );
  }

  /* ----------------------------------
   * CREATE CATEGORY GROUP
   * ---------------------------------- */
  createCategoryGroup(payload: {
    groupName: string;
    createdBy: number;
    image?: File;
  }): Observable<ApiResponse<CategoryGroup>> {

    const formData = new FormData();
    formData.append('groupname', payload.groupName);
    formData.append('createdby', payload.createdBy.toString());

    if (payload.image) {
      formData.append('image', payload.image);
    }

    return this.http.post<ApiResponse<CategoryGroup>>(
      this.apiUrl,
      formData
    );
  }

  /* ----------------------------------
 * GET CATEGORY GROUP BY ID
 * ---------------------------------- */
  getCategoryGroupById(groupId: number): Observable<CategoryGroup> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/${groupId}`)
      .pipe(
        map(res => ({
          groupid: res.data.groupid,
          groupname: res.data.groupname,
          imagepath: res.data.imagepath
        }))
      );
  }

  /* ----------------------------------
 * UPDATE CATEGORY GROUP
 * ---------------------------------- */
  updateCategoryGroup(
    groupId: number,
    payload: { groupName: string }
  ): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('groupname', payload.groupName);
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${groupId}`,
      formData
    );
  }

  /* ----------------------------------
 * DELETE CATEGORY GROUP
 * ---------------------------------- */
  deleteCategoryGroup(
    groupId: number,
    deletedBy: number
  ): Observable<ApiResponse<null>> {

    return this.http.request<ApiResponse<null>>(
      'DELETE',
      `${this.apiUrl}/${groupId}`,
      {
        body: { groupId, deletedBy }
      }
    );
  }

}
