import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { CartModel, DiscountRuleModel } from '../../../../core/models/cart/cart.model';
import { AuthStorageService } from '../../../../core/services/auth-storage/auth-storage.service';
import { ConfigService } from '../../../../core/config/config.service';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { RouterLink } from "@angular/router";
import { ShoppingCardComponent } from "../../../../shared/components/shopping-card/shopping-card.component";

@Component({
  selector: 'app-cart-list',
  standalone: true,
  templateUrl: './cart-list.component.html',
  imports: [BreadcrumbComponent, CommonModule, RouterLink, ShoppingCardComponent],
  providers: [CurrencyPipe]
})
export class CartListComponent implements OnInit, OnDestroy {

  /* =====================================================
   * STATE VARIABLES
   * ===================================================== */
  cartItems: CartModel[] = [];
  isLoading = true;
  currentCurrency: string = '';
  currentTaxPercentage : number = 0;
  currentUserDiscountRule: DiscountRuleModel = {
    displayName: '',
    orderCount: 0,
    rule: '',
    discount: 0,
  };

  private destroy$ = new Subject<void>();

  /* =====================================================
   * CONSTRUCTOR (DEPENDENCY INJECTION)
   * ===================================================== */
  constructor(
    private authStorage: AuthStorageService,
    private config: ConfigService,
    private cartFacade: CartFacadeService,
    private alertService: AlertService,
    private currencyService: CurrencyService,
    private currencyPipe: CurrencyPipe
  ) { }

  /* =====================================================
   * LIFECYCLE HOOKS
   * ===================================================== */

  /**
   * Initialize component
   * → Load cart data
   */
  ngOnInit(): void {
    /* Get the Default Tax From Configuration */
    this.currentTaxPercentage = this.config.TaxSettings.StandardTax;
    this.loadDiscountRule();
    this.loadCart();
  }

  /**
   * Cleanup subscriptions to avoid memory leaks
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* =====================================================
   * DATA LOADING
   * ===================================================== */

  /* Business Logic Based and User Discount Rule */
  private loadDiscountRule(): void {
    this.cartFacade.getDiscountRule()?.subscribe(res => {
      if (res.success) {
        this.currentUserDiscountRule = {
          displayName: this.getDiscountDisplayName(res.data.rule, res.data.discount, res.data.orderCount),
          orderCount: res.data.orderCount,
          rule: res.data.rule,
          discount: res.data.discount,
        }
      }
    });
  }
  private getDiscountDisplayName(rule: string, discount: number, orderCount: number): string {

    switch (rule) {

      case 'FIRST_ORDER':
        return `🎉 First order offer! You get ${discount}% OFF`;

      case 'LOYAL_CUSTOMER':
        return `❤️ Thanks for your ${orderCount} orders! Enjoy ${discount}% OFF`;

      case 'BULK_ORDER':
        return `🛒 Bulk order discount applied – Save ${discount}%`;

      case 'FESTIVE_OFFER':
        return `🎊 Special festive offer – ${discount}% OFF`;

      default:
        return `💸 You saved ${discount}% on this order`;
    }
  }

  /**
   * Fetch cart items + listen to currency changes
   * → Combines API response with currency stream
   * → Applies conversion & formatting
   */
  private loadCart(): void {

    this.isLoading = true;

    const cart$ = this.cartFacade.getCartItems();

    if (!cart$) {
      this.isLoading = false;
      return;
    }

    combineLatest([cart$, this.currencyService.currency$])
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: ([res, currency]) => {
          const items = res?.data ?? [];
          this.currentCurrency = currency;

          this.cartItems = items.map(item =>
            this.mapCartItem(item, currency)
          );
        },
        error: () => this.cartItems = []
      });
  }


  /**
   * Transform raw cart item
   * → Handles currency conversion
   * → Adds calculated fields
   */
  private mapCartItem(item: CartModel, currency: string): CartModel {

    const marketPrice = this.currencyService.convertPrice(item.marketprice, currency);
    const dealPrice = this.currencyService.convertPrice(item.dealprice, currency);
    const total = dealPrice * item.qty;
    const taxAmount = ((total * (item.taxpercentage || 0)) / 100);

    return {
      ...item,

      /* Raw numeric values */
      convertcurrenyprice: dealPrice,
      saveprice: marketPrice - dealPrice,
      taxamountdisplay: this.formatCurrency(taxAmount),
      finalamountdisplay: this.formatCurrency(total + taxAmount),

      /* Formatted values */
      displayprice: this.formatCurrency(dealPrice),
      displayamountprice: this.formatCurrency(total)
    };
  }

  /* =====================================================
   * UI ACTIONS (USER INTERACTIONS)
   * ===================================================== */

  /**
   * Increase item quantity
   */
  increaseQty(item: CartModel): void {
    item.qty++;
    this.updateItemTotal(item);
  }

  /**
   * Decrease item quantity (min = 1)
   */
  decreaseQty(item: CartModel): void {
    if (item.qty > 1) {
      item.qty--;
      this.updateItemTotal(item);
    }
  }

  /**
   * Remove item from cart
   * → Optimistic UI update
   * → Backend sync
   */
  removeItem(cartId: number): void {

    this.alertService.customConfirm({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from cart?',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'No',
      callback: () => {
        this.cartItems = this.cartItems.filter(x => x.cartid !== cartId);
        this.cartFacade.removeFromCart(cartId);
      }
    });
  }

  /* =====================================================
   * CALCULATIONS
   * ===================================================== */

  /**
   * Calculate total cart value (RAW)
   */
  getCartTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.qty * item.convertcurrenyprice),
      0
    );
  }

  /**
   * Get formatted cart total
   */
  getFormattedTotal(): string {
    return this.formatCurrency(this.getCartTotal());
  }


  /**
   * Calculate the Tax amount
   */
getCartTotalTax(): number {
   return this.cartItems.reduce(
      (sum, item) => sum + (item.qty * item.convertcurrenyprice) * (item.taxpercentage || 0) / 100,
      0
    );
}
  getFormattedTotalTax(): string {
    return this.formatCurrency(this.getCartTotalTax());
  }



  getDiscountAmount(): number {
    if (!this.currentUserDiscountRule) return 0;
    const total = this.getCartTotal() + this.getCartTotalTax();
    const discountPercent = this.currentUserDiscountRule.discount || 0;
    return (total * discountPercent) / 100;
  }
  getFormattedTotalDiscount(): string {
    return this.formatCurrency(this.getDiscountAmount());
  }

  getPayAmount(): number {
    if (!this.currentUserDiscountRule) return 0;
    const total = this.getCartTotal() + this.getCartTotalTax();
    const discountPercent = this.currentUserDiscountRule.discount || 0;
    return ((total) - ((total * discountPercent) / 100));
  }
  getFormattedTotalPay(): string {
    return this.formatCurrency(this.getPayAmount());
  }

  /**
   * Update item total when qty changes
   */
  private updateItemTotal(item: CartModel): void {
    const total = item.qty * item.convertcurrenyprice;
    const taxAmount = ((total * (item.taxpercentage || 0)) / 100);
    item.taxamountdisplay = this.formatCurrency(taxAmount);
    item.displayamountprice = this.formatCurrency(total);
    item.taxamountdisplay = this.formatCurrency(taxAmount);
    item.finalamountdisplay = this.formatCurrency(total + taxAmount);
  }

  /* =====================================================
   * HELPERS
   * ===================================================== */

  /**
   * Format currency consistently
   */
  private formatCurrency(value: number): string {
    return this.currencyPipe.transform(
      value,
      this.currentCurrency,
      'symbol',
      '1.2-2'
    ) || '';
  }

  /**
   * Get product image URL
   */
  getProductImage(item: CartModel): string {
    return item.image
      ? `${this.config.api.imageUrl}/${item.image}`
      : `${this.config.api.imageUrl}/images/default.jpg`;
  }



  /* =====================================================
   * Update Cart
   * ===================================================== */
  updateCart(): void {
    const user = this.authStorage.getUser(); // get current user
    const payload = {
      modifiedby: user?.userid || 0,
      items: this.cartItems.map(item => ({
        cartid: item.cartid,
        qty: item.qty
      }))
    };

    this.cartFacade.updateCartItems(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.success('Item quantity updated successfully');
          } else {
            this.alertService.error('Failed to update cart');
          }
        },
        error: () => {
          this.alertService.error('Something went wrong while updating cart');
        }
      });
  }
}
