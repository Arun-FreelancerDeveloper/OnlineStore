import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../../config/config.service';
import { RecommendedProductModel } from '../../../models/insights/recommended/recommended.model';
import { ApiPaginationResponse } from '../../../models/api-response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendedService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CACHE =====
  private cache = new Map<string, Observable<ApiPaginationResponse<RecommendedProductModel>>>();

  constructor() {
    // ✅ Correct way to access config
    this.apiUrl = `${this.config.api.baseUrl}/insights/recommended`;
  }

  /* =====================================================
   * GET RECOMMENDED PRODUCTS
   * ===================================================== */
  getRecommendedProducts(
    page: number = 1,
    pageSize: number = 10
  ): Observable<ApiPaginationResponse<RecommendedProductModel>> {
    const key = `recommended-${page}-${pageSize}`;
    if (!this.cache.has(key)) {
      const request$ = this.http
        .get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`)
        .pipe(
          map(res => ({
            success: res.success,
            message: res.message,
            data: {
              currentPage: res.data.currentPage,
              pageSize: res.data.pageSize,
              totalPages: res.data.totalPages,
              totalRecords: res.data.totalRecords,

              // ✅ IMPORTANT FIX
              data: res.data.data.map((item: any) =>
                this.mapProduct(item)
              )
            }
          })),
          shareReplay(1)
        );
      this.cache.set(key, request$);
    }
    return this.cache.get(key)!;
  }

  /* =====================================================
   * MAP PRODUCT (BASED ON YOUR RESPONSE)
   * ===================================================== */
  private mapProduct(item: any): RecommendedProductModel {
    return {
      productid: item.productid,
      productcode: item.productcode,
      productname: item.productname,
      shortdescription: "",

 // 🔥 Your API uses "image" not "productimage"
      productimage: item.image
        ? `${this.config.api.imageUrl}/${item.priductimage}`
        : `${this.config.api.imageUrl}/images/default.jpg`,
      ishasclude: item.ishasclude,
      cludeimage: item.cludeimage
        ? `${item.cludeimage}`
        : `${this.config.api.imageUrl}/images/default.jpg`,

      groupid: item.groupid,
      groupname: item.groupname,

      categoryid: item.categoryid,
      categoryname: item.categoryname,

      subcategoryid: item.subcategoryid,
      subcategoryname: item.subcategoryname,

      deptid: item.deptid,
      deptname: item.deptname,

      storeid: item.storeid,
      storename: item.storename,

      // ✅ PRICE
      mrp: Number(item.mrp) || 0,
      wholesaleprice: Number(item.wholesaleprice) || 0,

      // 🔥 CORRECT SELLING PRICE
      displayprice: Number(item.wholesaleprice || item.mrp) || 0,

      // ✅ SALES DATA
      total_sold: Number(item.total_sold) || 0,
      total_stock: Number(item.total_stock) || 0,

      // ✅ PERCENTAGES
      total_soldpercentage: Number(item.total_soldpercentage) || 0,
      discount_percentage: Number(item.discount_percentage) || 0,

      // ✅ RECOMMENDATION SCORE
      recommendation_score: Number(item.recommendation_score) || 0,
      // ✅ IMAGES ARRAY
      images: []
    };
  }
}
