import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../../config/config.service';
import { FlashSaleProductModel } from '../../../models/insights/flashsale/flashsale.model';
import { ApiPaginationResponse } from '../../../models/api-response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FlashSaleService {

  // ===== DEPENDENCIES =====
    private readonly http = inject(HttpClient);
    private readonly config = inject(ConfigService);

    // ===== API =====
    private apiUrl!: string;

    // ===== CACHE =====
    private cache = new Map<string, Observable<ApiPaginationResponse<FlashSaleProductModel>>>();

    constructor() {
      // ✅ Correct way to access config
      this.apiUrl = `${this.config.api.baseUrl}/insights/flashsale`;
    }

  /* =====================================================
   * GET FLASH SALE PRODUCTS
   * ===================================================== */
  getFlashSaleProducts(
    page: number = 1,
    pageSize: number = 10
  ): Observable<ApiPaginationResponse<FlashSaleProductModel>> {

    const key = `flash-${page}-${pageSize}`;
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
  private mapProduct(item: any): FlashSaleProductModel {
    return {
      productid: item.productid,
      productcode: item.productcode,
      productname: item.productname,
      shortdescription: '',

      // ✅ FIX: API already gives productimage
          // 🔥 Your API uses "image" not "productimage"
      productimage: ${this.config.api.imageUrl}/${item.image},
      ishasclude: item.ishasclude,
      cludeimage: ${this.config.api.imageUrl}/${item.image},


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

      // ✅ Convert string → number
      mrp: Number(item.mrp),
      wholesaleprice: Number(item.wholesaleprice),

      displayprice: Number(item.mrp),

      images: [],

      // Optional (if you want)
      total_sold: Number(item.total_sold)
    };
  }
}
