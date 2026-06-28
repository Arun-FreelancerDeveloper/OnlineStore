import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.BASE_URL}/product`;

  getProducts(
    categoryId: number,
    page = 1,
    pageSize = 100,
    findWhat = ''
  ): Observable<Product[]> {
    const query = new URLSearchParams({
      categoryId: categoryId.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
      findWhat
    });

    return this.http
      .get<ApiResponse<{ data: any[] }>>(`${this.apiUrl}?${query}`)
      .pipe(
        map(res =>
          (res.data?.data || []).map(item => ({
            productid: item.productid,
            productcode: item.productcode,
            productname: item.productname,
            shortdescription: item.shortdescription,
            productimage: item.productimage,
            categoryid: item.categoryid,
            categoryname: item.categoryname,
            subcategoryid: item.subcategoryid,
            subcategoryname: item.subcategoryname,
            deptid: item.deptid,
            deptname: item.deptname,
            storeid: item.storeid,
            storename: item.storename,
            mrp: item.mrp,
            wholesaleprice: item.wholesaleprice
          }))
        ),
        shareReplay(1)
      );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/${productId}`)
      .pipe(
        map(res => ({
          productid: res.data.productid,
          productcode: res.data.productcode,
          productname: res.data.productname,
          shortdescription: res.data.shortdescription,
          productimage: res.data.productimage,
          categoryid: res.data.categoryid,
          categoryname: res.data.categoryname,
          subcategoryid: res.data.subcategoryid,
          subcategoryname: res.data.subcategoryname,
          deptid: res.data.deptid,
          deptname: res.data.deptname,
          storeid: res.data.storeid,
          storename: res.data.storename,
          mrp: res.data.mrp,
          wholesaleprice: res.data.wholesaleprice
        }))
      );
  }

  createProduct(payload: {
    productcode?: string;
    productname: string;
    shortdescription?: string;
    categoryid: number;
    subcategoryid?: number | null;
    deptid?: number | null;
    storeid?: number | null;
    createdby: number;
    images?: File[];
  }): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('productname', payload.productname);
    formData.append('categoryid', payload.categoryid.toString());
    formData.append('createdby', payload.createdby.toString());

    if (payload.productcode) {
      formData.append('productcode', payload.productcode);
    }

    if (payload.shortdescription) {
      formData.append('shortdescription', payload.shortdescription);
    }

    if (payload.subcategoryid !== undefined && payload.subcategoryid !== null) {
      formData.append('subcategoryid', payload.subcategoryid.toString());
    }

    if (payload.deptid !== undefined && payload.deptid !== null) {
      formData.append('deptid', payload.deptid.toString());
    }

    if (payload.storeid !== undefined && payload.storeid !== null) {
      formData.append('storeid', payload.storeid.toString());
    }

    if (payload.images?.length) {
      payload.images.forEach((file) => formData.append('images', file));
    }

    return this.http.post<ApiResponse<any>>(this.apiUrl, formData);
  }

  updateProduct(
    productId: number,
    payload: {
      productcode?: string;
      productname: string;
      shortdescription?: string;
      categoryid: number;
      subcategoryid?: number | null;
      deptid?: number | null;
      storeid?: number | null;
      modifiedby: number;
      images?: File[];
    }
  ): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('productname', payload.productname);
    formData.append('categoryid', payload.categoryid.toString());
    formData.append('modifiedby', payload.modifiedby.toString());

    if (payload.productcode) {
      formData.append('productcode', payload.productcode);
    }

    if (payload.shortdescription) {
      formData.append('shortdescription', payload.shortdescription);
    }

    if (payload.subcategoryid !== undefined && payload.subcategoryid !== null) {
      formData.append('subcategoryid', payload.subcategoryid.toString());
    }

    if (payload.deptid !== undefined && payload.deptid !== null) {
      formData.append('deptid', payload.deptid.toString());
    }

    if (payload.storeid !== undefined && payload.storeid !== null) {
      formData.append('storeid', payload.storeid.toString());
    }

    if (payload.images?.length) {
      payload.images.forEach((file) => formData.append('images', file));
    }

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${productId}`,
      formData
    );
  }

  deleteProduct(productId: number, deletedBy: number): Observable<ApiResponse<null>> {
    return this.http.request<ApiResponse<null>>('DELETE', `${this.apiUrl}/${productId}`, {
      body: { deletedBy }
    });
  }
}
