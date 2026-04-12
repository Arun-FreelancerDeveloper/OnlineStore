import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../../../core/config/config.service';
import { ProductModel } from '../../../../core/models/product/product.model';
import { ApiPaginationResponse } from '../../../../core/models/api-response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductViewService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CACHE =====
  private cache = new Map<string, Observable<ApiPaginationResponse<ProductModel>>>();
  private productCache = new Map<number, Observable<ProductModel>>();

  constructor() {
    this.apiUrl = `${this.config.api.baseUrl}/product`;
  }

  /* =====================================================
   * GET PRODUCTS (LIST WITH PAGINATION)
   * ===================================================== */
  getProducts(productId: number): Observable<ApiPaginationResponse<ProductModel>> {
    const key = `${productId}`;

    if (!this.cache.has(key)) {
      const request$ = this.http
        .get<ApiPaginationResponse<ApiPaginationResponse<ProductModel>>>(
          `${this.apiUrl}?productId=${productId}`
        )
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

  /* =====================================================
   * GET PRODUCT BY ID (DETAIL PAGE)
   * ===================================================== */
  getProductById(productId: number): Observable<ProductModel> {

    if (!this.productCache.has(productId)) {
      const request$ = this.http
        .get<any>(`${this.apiUrl}/${productId}`)
        .pipe(
          map(res => this.mapProductDetails(res.data)),
          shareReplay(1)
        );

      this.productCache.set(productId, request$);
    }

    return this.productCache.get(productId)!;
  }

  /* =====================================================
   * MAP LIST PRODUCT
   * ===================================================== */
  private mapProduct(item: any): ProductModel {
    return {
      productid: item.productid,
      productcode: item.productcode,
      productname: item.productname,
      shortdescription: item.shortdescription,

      productimage: item.image
        ? `${this.config.api.imageUrl}/${item.image}`
        : `${this.config.api.imageUrl}/images/default.jpg`,

      ishasclude: item.ishasclude,
      cludeimage: item.cludeimage
        ? `${this.config.api.imageUrl}/${item.cludeimage}`
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

      mrp: Number(item.mrp) || 0,
      wholesaleprice: Number(item.wholesaleprice) || 0,
      displayprice: Number(item.wholesaleprice || item.mrp) || 0,

      total_sold: Number(item.total_sold) || 0,
      total_stock: Number(item.total_stock) || 0,
      total_soldpercentage: Number(item.total_soldpercentage) || 0,

      images: []
    };
  }

  /* =====================================================
   * MAP PRODUCT DETAILS (NEW API)
   * ===================================================== */
  private mapProductDetails(item: any): ProductModel {

    const primaryImage = item.images?.find((img: any) => img.isprimary);

    return {
      productid: item.productid,
      productcode: item.productcode,
      productname: item.productname,
      shortdescription: item.shortdescription,

      // ✅ PRIMARY IMAGE
      productimage: primaryImage
        ? `${this.config.api.imageUrl}/${primaryImage.imagepath}`
        : `${this.config.api.imageUrl}/images/default.jpg`,

      ishasclude: primaryImage?.ishasclude || false,

      cludeimage: primaryImage?.cludeimagepath
        ? `${this.config.api.imageUrl}/${primaryImage.cludeimagepath}`
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

      mrp: Number(item.mrp) || 0,
      wholesaleprice: Number(item.wholesaleprice) || 0,
      displayprice: Number(item.wholesaleprice || item.mrp) || 0,

      total_sold: Number(item.total_sold) || 0,
      total_stock: Number(item.total_stock) || 0,
      total_soldpercentage: Number(item.total_soldpercentage) || 0,

      // ✅ ALL IMAGES
      // images: item.images?.map((img: any) => ({
      //   productimageid: img.productimageid,
      //   imagepath: `${this.config.api.imageUrl}/${img.imagepath}`,
      //   isprimary: img.isprimary,
      //   ishasclude: img.ishasclude,
      //   cludeimagepath: img.cludeimagepath
      //     ? `${this.config.api.imageUrl}/${img.cludeimagepath}`
      //     : ''
      // })) || []

      images: item.images?.map((img: any) => {
        let path = '';
        if (img.ishasclude && img.cludeimagepath) {
          path = img.cludeimagepath; // external/CDN
        } else if (img.imagepath) {
          path = `${this.config.api.imageUrl}/${img.imagepath}`; // local
        } else {
          path = `${this.config.api.imageUrl}/images/default.jpg`; // fallback
        }
        return {
          productimageid: img.productimageid,
          imagepath: path,
          isprimary: img.isprimary,
          ishasclude: img.ishasclude
        };
      }) || []
    };
  }

  /* =====================================================
   * CLEAR CACHE (OPTIONAL)
   * ===================================================== */
  clearCache() {
    this.cache.clear();
    this.productCache.clear();
  }
}
