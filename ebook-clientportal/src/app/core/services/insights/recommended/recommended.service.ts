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
  private apiUrl: string;

  // ===== CACHE WITH TTL =====
  private cache = new Map<
    string,
    { expiry: number; data$: Observable<ApiPaginationResponse<RecommendedProductModel>> }
  >();

  private readonly CACHE_TTL = 5 * 60 * 1000;

  // Default image
  private readonly DEFAULT_IMAGE = 'assets/images/no-image.png';

  constructor() {
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
    const now = Date.now();

    const cached = this.cache.get(key);

    // ✅ Return cached if not expired
    if (cached && cached.expiry > now) {
      return cached.data$;
    }

    const request$ = this.http
      .get<ApiPaginationResponse<any>>(
        `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
      )
      .pipe(
        map(res => ({
          success: res?.success ?? false,
          message: res?.message ?? '',
          data: {
            currentPage: res?.data?.currentPage ?? 1,
            pageSize: res?.data?.pageSize ?? pageSize,
            totalPages: res?.data?.totalPages ?? 0,
            totalRecords: res?.data?.totalRecords ?? 0,

            data: (res?.data?.data || []).map((item: any) =>
              this.mapProduct(item)
            )
          }
        })),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    // ✅ Cache only on success
    request$.subscribe({
      next: () => {
        this.cache.set(key, {
          expiry: now + this.CACHE_TTL,
          data$: request$
        });
      },
      error: () => {
        this.cache.delete(key);
      }
    });

    return request$;
  }

  /* =====================================================
   * CLEAR CACHE
   * ===================================================== */
  clearCache(): void {
    this.cache.clear();
  }

  /* =====================================================
   * MAP PRODUCT
   * ===================================================== */
  private mapProduct(item: any): RecommendedProductModel {

    // 🔥 FIX: Use correct field (image)
    const imagePath = item?.productimage
      ? `${this.config.api.imageUrl}/${item.productimage}`
      : this.DEFAULT_IMAGE;

    const cludeImagePath = item?.productcludeimage
      ? `${item.productcludeimage}`
      : this.DEFAULT_IMAGE;

    return {
      productid: item?.productid ?? 0,
      productcode: item?.productcode ?? '',
      productname: item?.productname ?? '',
      shortdescription: "",

      productimage: imagePath,
      ishasclude: Boolean(item?.ishasclude),
      cludeimage: cludeImagePath,

      groupid: item?.groupid ?? 0,
      groupname: item?.groupname ?? '',

      categoryid: item?.categoryid ?? 0,
      categoryname: item?.categoryname ?? '',

      subcategoryid: item?.subcategoryid ?? 0,
      subcategoryname: item?.subcategoryname ?? '',

      deptid: item?.deptid ?? 0,
      deptname: item?.deptname ?? '',

      storeid: item?.storeid ?? 0,
      storename: item?.storename ?? '',

      mrp: Number(item?.mrp) || 0,
      wholesaleprice: Number(item?.wholesaleprice) || 0,

      displayprice: Number(item?.wholesaleprice || item?.mrp) || 0,

      total_sold: Number(item?.total_sold) || 0,
      total_stock: Number(item?.total_stock) || 0,

      total_soldpercentage: Number(item?.total_soldpercentage) || 0,
      discount_percentage: Number(item?.discount_percentage) || 0,

      recommendation_score: Number(item?.recommendation_score) || 0,

      images: []
    };
  }
}