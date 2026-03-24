import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

import { ConfigService } from '../../../core/config/config.service';
import { ApiResponse } from '../../../core/models/api-response/api-response.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  // ================= DEPENDENCY =================
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  // ================= API =================
  private readonly apiUrl = `${this.config.api.baseUrl}/cart`;

  // ================= CART COUNT =================
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  private updateCartCount(count: number) {
    this.cartCountSubject.next(count);
  }

  // ================= CACHE =================
  private cartCache: CartItem[] | null = null;
  private cartRequest$?: Observable<ApiResponse<CartItem[]>>;

  // ================= GET CART =================
  getCartItems(userid: number): Observable<ApiResponse<CartItem[]>> {

    // ✅ RETURN CACHE
    if (this.cartCache) {
      return of({
        success: true,
        data: this.cartCache
      } as ApiResponse<CartItem[]>);
    }

    // ✅ PREVENT MULTIPLE API CALLS
    if (this.cartRequest$) {
      return this.cartRequest$;
    }

    // ✅ API CALL
    this.cartRequest$ = this.http
      .get<ApiResponse<CartItem[]>>(`${this.apiUrl}/${userid}`)
      .pipe(
        tap(res => {
          if (res?.data) {
            this.cartCache = res.data;
            this.updateCartCount(res.data.length);
          }
        }),
        shareReplay(1) // 🚀 important
      );

    return this.cartRequest$;
  }

  // ================= LOAD COUNT ONLY =================
  loadCartCount(userid: number): void {
    this.getCartItems(userid).subscribe();
  }

  // ================= ADD =================
  addToCart(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, payload).pipe(
      tap(() => this.invalidateCache())
    );
  }

  // ================= REMOVE =================
  removeItem(cartid: number, deletedBy: number): Observable<ApiResponse<any>> {

    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${cartid}`,
      {
        body: { deletedby: deletedBy }
      }
    ).pipe(
      tap(() => {
        if (this.cartCache) {
          this.cartCache = this.cartCache.filter(x => x.cartid !== cartid);
          this.updateCartCount(this.cartCache.length);
        }
      })
    );
  }

  // ================= UPDATE =================
  updateCartItems(payload: {
    modifiedby: number;
    items: { cartid: number; qty: number }[];
  }): Observable<ApiResponse<any>> {

    return this.http.put<ApiResponse<any>>(this.apiUrl, payload).pipe(
      tap(() => this.invalidateCache())
    );
  }

  // ================= CACHE HELPERS =================
  private invalidateCache(): void {
    this.cartCache = null;
    this.cartRequest$ = undefined;
  }

  clearCart(): void {
    this.invalidateCache();
    this.updateCartCount(0);
  }
}
