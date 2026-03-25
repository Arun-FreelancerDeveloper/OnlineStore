import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../core/services/cart/cart.service';
import { AuthStorageService } from '../../core/services/auth-storage/auth-storage.service';
import { AlertService } from '../../shared/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CartFacadeService {

  // ===== DEPENDENCIES =====
  private readonly cartService = inject(CartService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  // ✅ ADD THIS LINE
  cartCount$ = this.cartService.cartCount$;

  /* =====================================================
   * USER HELPER
   * ===================================================== */
  private get user() {
    return this.authStorage.getUser();
  }

  /* =====================================================
   * ADD TO CART
   * ===================================================== */
  addToCart(productId: number, qty: number = 1): void {

    // 🔐 Check login
    if (!this.user) {
      this.loginRequired();
      return;
    }

    const payload = {
      userid: this.user.userid,
      productid: productId,
      qty,
      createdby: this.user.userid
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {

        // ✅ Success Message
        this.alertService.success('Item added to cart');

        // 🔄 Sync with server
        this.refreshCartCount();

      },
      error: err => {
        this.alertService.error(
          err?.error?.message || 'Failed to add item to cart'
        );
      }

    });
  }

  /* =====================================================
   * REMOVE FROM CART
   * ===================================================== */
  removeFromCart(cartid: number): void {

    if (!this.user) return;

    this.cartService.removeItem(cartid, this.user.userid).subscribe({
      next: () => {

        this.alertService.success('Item removed from cart');

        // 🔄 Update UI instantly
        const updatedCache = this.cartService
          .getCartCache()
          .filter(x => x.cartid !== cartid);

        this.cartService.setCartCache(updatedCache);

        // 🔄 Sync again
        this.refreshCartCount();
      },
      error: () => {
        this.alertService.error('Failed to remove cart item');
      }
    });
  }

  /* =====================================================
   * LOAD CART COUNT (ON APP START)
   * ===================================================== */
  loadCartCount(): void {

    console.log('USER:', this.user); // 👈 check this

    if (!this.user) return;

    this.cartService.loadCartCount(this.user.userid).subscribe({
      next: (res) => {
        console.log('CART API RESPONSE:', res); // 👈 check this
      },
      error: () => this.cartService.setCartCount(0)
    });
  }

  /* =====================================================
 * LOAD CART (ON APP START)
 * ===================================================== */
  getCartItems() {
    if (!this.user) {
      this.loginRequired();
      return null; // ⚠️ handle in component
    }
    return this.cartService.getCartItems(this.user.userid);
  }


  /* =====================================================
   * REFRESH CART COUNT
   * ===================================================== */
  private refreshCartCount(): void {

    if (!this.user) return;
    this.cartService.loadCartCount(this.user.userid).subscribe({
      next: () => { },
      error: () => this.cartService.setCartCount(0)
    });
  }

  /* =====================================================
   * LOGIN REQUIRED POPUP
   * ===================================================== */
  private loginRequired(): void {
    this.alertService.customConfirm({
      title: 'Login Required!',
      message: 'Please login to add items to your cart.',
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      callback: () => {
        this.router.navigate(['/Account'], {
          queryParams: { returnUrl: this.router.url }
        });
      }
    });
  }

  /* =====================================================
 * GET DISCOUNT RULE
 * ===================================================== */
  getDiscountRule() {
    if (!this.user) {
      this.loginRequired();
      return null; // ⚠️ handle in component
    }
    return this.cartService.getDiscountRule(this.user.userid);
  }

  clearCartCache(): void {

    this.cartService.setCartCache([]);

    // 🔄 Sync again
    this.refreshCartCount();

  }
}
