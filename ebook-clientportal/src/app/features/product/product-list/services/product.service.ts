import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../../../core/config/config.service';
import { ProductModel } from '../../../../core/models/product/product.model';
import { ApiPaginationResponse } from '../../../../core/models/api-response/api-response.model';

export interface ProductSearchSuggestion {
  productid: number;
  productname: string;
  categoryid?: number;
  subcategoryid?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CACHE =====
  private cache = new Map<string, Observable<ApiPaginationResponse<ProductModel>>>();

  constructor() {
    // ✅ Correct way to access config
    this.apiUrl = `${this.config.api.baseUrl}/product`;
  }

  /* =====================================================
   * GET PRODUCTS (WITH CATEGORY + PAGINATION)
   * ===================================================== */
  getProducts(
    categoryId: number | null = 0,
    page: number = 1,
    pageSize: number = 10,
    findWhat: string = ''
  ): Observable<ApiPaginationResponse<ProductModel>> {
    const key = `${categoryId || 0}-${page}-${pageSize}-${findWhat}`;
    if (!this.cache.has(key)) {

      const params = [
        `page=${page}`,
        `pageSize=${pageSize}`
      ];

      if (categoryId && categoryId > 0) {
        params.push(`categoryId=${categoryId}`);
      }

      if (findWhat.trim()) {
        params.push(`findWhat=${encodeURIComponent(findWhat.trim())}`);
      }

      const request$ = this.http
        .get<ApiPaginationResponse<any>>(`${this.apiUrl}?${params.join('&')}`)
        .pipe(
          map(res => ({
            success: res.success,
            message: res.message,
            data: {
              currentPage: res.data.currentPage,
              pageSize: res.data.pageSize,
              totalPages: res.data.totalPages,
              totalRecords: res.data.totalRecords,
              data: res.data.data.map(item => this.mapProduct(item))
            }
          })),
          shareReplay(1)
        );

      this.cache.set(key, request$);
    }

    return this.cache.get(key)!;
  }

  searchSuggestions(
    term: string,
    categoryId?: number
  ): Observable<ProductSearchSuggestion[]> {
    const params = [
      `page=1`,
      `pageSize=8`,
      `findWhat=${encodeURIComponent(term.trim())}`
    ];

    if (categoryId && categoryId > 0) {
      params.push(`categoryId=${categoryId}`);
    }

    return this.http
      .get<ApiPaginationResponse<any>>(`${this.apiUrl}?${params.join('&')}`)
      .pipe(
        map(res => res.data.data.map((item: any) => ({
          productid: item.productid,
          productname: item.productname,
          categoryid: item.categoryid,
          subcategoryid: item.subcategoryid
        }))),
        catchError(() => of([]))
      );
  }

  /* =====================================================
   * MAP FUNCTION (ADJUSTED TO YOUR API)
   * ===================================================== */
  private mapProduct(item: any): ProductModel {
    return {
      productid: item.productid,
      productcode: item.productcode,
      productname: item.productname,
      shortdescription: item.shortdescription,

      // 🔥 Your API uses "image" not "productimage"
      productimage: item.image
        ? `${this.config.api.imageUrl}/${item.image}`
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

      images: []
    };
  }
}
