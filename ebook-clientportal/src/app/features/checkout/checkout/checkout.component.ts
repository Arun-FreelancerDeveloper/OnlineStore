import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { CartModel, DiscountRuleModel } from '../../../core/models/cart/cart.model';
import { AuthStorageService } from '../../../core/services/auth-storage/auth-storage.service';
import { CartFacadeService } from '../../../core/facades/cart-facade.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { ShoppingCardComponent } from "../../../shared/components/shopping-card/shopping-card.component";
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  standalone: true,
  providers: [CurrencyPipe],
  imports: [CommonModule, FormsModule, ShoppingCardComponent, BreadcrumbComponent]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  cartItems: CartModel[] = [];
  currentCurrency: string = '';
  currentUserDiscountRule: DiscountRuleModel = {
    displayName: '',
    orderCount: 0,
    rule: '',
    discount: 0
  };
  isLoading = true;
  selectedPayment: string = 'Direct Bank transfer';
  paymentMethods = [
    {
      label: 'Direct Bank transfer',
      description: 'Make your payment directly into our bank account. Your order will not be shipped until funds are cleared.'
    },
    {
      label: 'Check payments',
      description: 'Please send your check payment using your Order ID as reference.'
    },
    {
      label: 'Cash on delivery',
      description: 'Pay with cash upon delivery.'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private cartFacade: CartFacadeService,
    private currencyService: CurrencyService,
    private authStorage: AuthStorageService,
    private currencyPipe: CurrencyPipe,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadDiscountRule();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCart(): void {
    const cart$ = this.cartFacade.getCartItems();
    if (!cart$) { this.isLoading = false; return; }

    combineLatest([cart$, this.currencyService.currency$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([res, currency]) => {
        this.isLoading = false;
        this.currentCurrency = currency;
        console.log('Cart Items from backend:', res?.data); // Check if backend returns data
        this.cartItems = (res?.data ?? []).map(item => ({
          ...item,
          convertcurrenyprice: this.currencyService.convertPrice(item.dealprice, currency),
          displayamountprice: this.currencyPipe.transform(item.dealprice * item.qty, currency, 'symbol', '1.2-2') || '',
          displayprice: this.currencyPipe.transform(item.dealprice, currency, 'symbol', '1.2-2') || ''
        }));
      });
  }

  private loadDiscountRule(): void {
    this.cartFacade.getDiscountRule()?.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success) {
        this.currentUserDiscountRule = {
          displayName: res.data.displayName || '',
          orderCount: res.data.orderCount,
          rule: res.data.rule,
          discount: res.data.discount
        };
      }
    });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.qty * item.convertcurrenyprice, 0);
  }

  getDiscountAmount(): number {
    return (this.getCartTotal() * (this.currentUserDiscountRule.discount || 0)) / 100;
  }

  getPayAmount(): number {
    return this.getCartTotal() - this.getDiscountAmount();
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, this.currentCurrency, 'symbol', '1.2-2') || '';
  }

  placeOrder(): void {
    const user = this.authStorage.getUser();
    if (!user) {
      this.alertService.error('Please login to place order');
      return;
    }

    const payload = {
      userid: user.userid,
      items: this.cartItems.map(x => ({ cartid: x.cartid, qty: x.qty })),
      totalAmount: this.getPayAmount(),
      discount: this.getDiscountAmount()
    };

    // Uncomment and implement API call when backend is ready
    // this.cartFacade.placeOrder(payload).pipe(takeUntil(this.destroy$)).subscribe({
    //   next: res => res.success
    //     ? this.alertService.success('Order placed successfully! 🎉')
    //     : this.alertService.error('Failed to place order'),
    //   error: () => this.alertService.error('Something went wrong')
    // });
  }
}
