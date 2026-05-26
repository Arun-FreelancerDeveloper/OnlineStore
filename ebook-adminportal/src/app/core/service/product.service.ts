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

  getProducts(categoryId: number): Observable<Product[]> {
    return this.http
      .get<ApiResponse<any[]>>(this.apiUrl + '/category/' + categoryId)
      .pipe(
        map(res =>
          res.data.map(item => ({
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
}
