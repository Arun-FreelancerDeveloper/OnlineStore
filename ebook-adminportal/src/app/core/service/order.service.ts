import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.BASE_URL}/order`;

  /* ============================
   * GET ALL ORDERS
   * ============================ */
  getOrders(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(this.apiUrl)
      .pipe(
        map(res =>
          res.data.map(item => ({
            orderid: item.orderid,
            orderno: item.orderno,
            orderdate: item.orderdate,
            orderstatus: item.orderstatus,
            totalamount: item.totalamount,
            paymentstatus: item.paymentstatus,
            shippingname: item.shippingname
          }))
        ),
        shareReplay(1)
      );
  }

  // ✅ GET ORDER DETAILS BY ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/${orderId}`)
      .pipe(
        map(res => ({
          orderid: res.data.orderid,
            orderno: res.data.orderno,
            orderdate: res.data.orderdate,
            orderstatus: res.data.orderstatus,
            totalamount: Number(res.data.totalamount),
            paymentstatus: res.data.paymentstatus,
            shippingaddress: res.data.shippingaddress,
            items: res.data.items
        }))
      );
  }
}
