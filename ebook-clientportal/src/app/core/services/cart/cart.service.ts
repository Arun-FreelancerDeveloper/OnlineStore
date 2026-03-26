import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { CartModel, DiscountRuleModel } from '../../models/cart/cart.model';
import { ConfigService } from '../../config/config.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private apiUrl!: string;

  // ===== CART COUNT =====
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private discountCache?: DiscountRuleModel;

  // ===== CACHE =====
  private cartCache: CartModel[] = [];

  constructor() {
    // ✅ SAME AS YOUR FlashSaleService
    this.apiUrl = `${this.config.api.baseUrl}/cart`;
  }

  /* =====================================================
   * CART COUNT
   * ===================================================== */
  setCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  /* =====================================================
   * CACHE METHODS
   * ===================================================== */
  getCartCache(): CartModel[] {
    return this.cartCache;
  }

  setCartCache(items: CartModel[]): void {
    this.cartCache = items;
    this.setCartCount(items.length);
  }

  clearCartCache(): void {
    this.cartCache = [];
    this.setCartCount(0);
  }

  /* =====================================================
   * GET CART ITEMS
   * ===================================================== */
  getCartItems(userid: number): Observable<ApiResponse<CartModel[]>> {

    if (this.cartCache.length > 0) {
      return of({
        success: true,
        data: this.cartCache
      } as ApiResponse<CartModel[]>);
    }

    return this.http
      .get<ApiResponse<CartModel[]>>(`${this.apiUrl}/${userid}`)
      .pipe(
        tap(res => {
          if (res?.data) {
            this.setCartCache(res.data);
          }
        })
      );
  }

  /* =====================================================
   * ADD TO CART
   * ===================================================== */
  addToCart(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => {
        // OPTIONAL: Just increase count locally
        this.cartCache = [];
        const current = this.cartCountSubject.value;
        this.setCartCount(current + 1);
      })
    );
  }

  /* =====================================================
   * REMOVE ITEM
   * ===================================================== */
  removeItem(cartid: number, deletedBy: number): Observable<ApiResponse<any>> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        accept: '*/*'
      }),
      body: { deletedby: deletedBy }
    };

    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${cartid}`, options)
      .pipe(
        tap(() => {
          this.cartCache = this.cartCache.filter(x => x.cartid !== cartid);
          this.setCartCount(this.cartCache.length);
        })
      );
  }

  /* =====================================================
   * UPDATE CART
   * ===================================================== */
  updateCartItems(payload: {
    modifiedby: number;
    items: { cartid: number; qty: number }[];
  }): Observable<ApiResponse<any>> {

    return this.http
      .put<ApiResponse<any>>(this.apiUrl, payload)
      .pipe(
        tap(() => this.clearCartCache())
      );
  }

  /* =====================================================
  * LOAD CART
  * ===================================================== */
  loadCartCount(userid: number) {
    return this.http
      .get<any>(`${this.apiUrl}/${userid}`)
      .pipe(
        tap(res => {
          const count = res?.data?.length || 0;
          this.setCartCount(count);
        })
      );
  }

  /* =====================================================
 * GET DISCOUNT RULE
 * ===================================================== */
  getDiscountRule(userId: number): Observable<ApiResponse<DiscountRuleModel>> {
    if (this.discountCache) {
      return of({
        success: true,
        data: this.discountCache
      } as ApiResponse<DiscountRuleModel>);
    }

    return this.http
      .get<ApiResponse<DiscountRuleModel>>(
        `${this.apiUrl}/discountrule/${userId}`
      )
      .pipe(
        tap(res => {
          if (res?.data) {
            this.discountCache = res.data;
          }
        })
      );
  }

  
}
