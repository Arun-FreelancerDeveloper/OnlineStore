import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { ConfigService } from '../../config/config.service';
import { PlaceOrderPayload } from '../../models/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CACHE =====
  private orderCache: any[] = [];
  private orderSubject = new BehaviorSubject<any[]>([]);
  orders$ = this.orderSubject.asObservable();

  constructor() {
    this.apiUrl = `${this.config.api.baseUrl}/order`;
  }

  /* =====================================================
   * CACHE METHODS
   * ===================================================== */
  setOrderCache(data: any[]): void {
    this.orderCache = data;
    this.orderSubject.next(data);
  }

  clearOrderCache(): void {
    this.orderCache = [];
    this.orderSubject.next([]);
  }

  getOrderCache(): any[] {
    return this.orderCache;
  }

  /* =====================================================
   * PLACE ORDER
   * ===================================================== */
 placeOrder(payload: PlaceOrderPayload): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(this.apiUrl, payload).pipe(
    tap(() => this.clearOrderCache())
  );
}

  /* =====================================================
   * GET ORDERS BY USER
   * ===================================================== */
  getOrdersByUser(userid: number): Observable<ApiResponse<any[]>> {

    if (this.orderCache.length > 0) {
      return of({
        success: true,
        data: this.orderCache
      } as ApiResponse<any[]>);
    }

    return this.http
      .get<ApiResponse<any[]>>(`${this.apiUrl}/user/${userid}`)
      .pipe(
        tap(res => {
          if (res?.data) {
            this.setOrderCache(res.data);
          }
        })
      );
  }

  /* =====================================================
   * GET ORDER BY ID
   * ===================================================== */
  getOrderById(orderid: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${orderid}`);
  }

  /* =====================================================
   * GET ORDER BY INVOICE NO
   * ===================================================== */
  getOrderByInvoiceNo(orderno: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/no/${orderno}`
    );
  }

  /* =====================================================
   * UPDATE ORDER STATUS
   * ===================================================== */
  updateOrderStatus(
    orderid: number,
    payload: { status: string; remarks?: string; modifiedby: number }
  ): Observable<ApiResponse<any>> {

    return this.http
      .put<ApiResponse<any>>(
        `${this.apiUrl}/${orderid}/status`,
        payload
      )
      .pipe(
        tap(() => this.clearOrderCache())
      );
  }

  /* =====================================================
   * DELETE ORDER
   * ===================================================== */
  deleteOrder(orderid: number, deletedby: number): Observable<ApiResponse<any>> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        accept: '*/*'
      }),
      body: { deletedby }
    };

    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${orderid}`, options)
      .pipe(
        tap(() => this.clearOrderCache())
      );
  }

  /* =====================================================
   * ORDER STATUS HISTORY
   * ===================================================== */
  getOrderStatusHistory(orderid: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/${orderid}/status-history`
    );
  }
}
