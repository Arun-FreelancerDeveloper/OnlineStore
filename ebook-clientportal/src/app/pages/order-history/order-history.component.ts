import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

import { OrderService } from '../../core/services/order/order.service';
import { AuthStorageService } from '../../core/services/auth-storage/auth-storage.service';
import { CurrencyService } from '../../core/services/currency/currency.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [CurrencyPipe]  // <<<<< Add this
})
export class OrderHistoryComponent {

  private orderService = inject(OrderService);
  private authService = inject(AuthStorageService);
  private currencyService = inject(CurrencyService);

  orders: any[] = [];
  loading = false;
  selectedOrder: any = null; // for details view

  ngOnInit(): void {
    this.loadOrders();
  }
  constructor(private currencyPipe: CurrencyPipe) { }

  loadOrders() {
    const user = this.authService.getUser();
    if (!user) return;

    this.loading = true;

    this.orderService.getOrdersByUser(user.userid)
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.orders = res.data || [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  viewDetails(order: any) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  format(amount: number, currency: string): string {
    return this.currencyPipe.transform(
      amount || 0,
      currency || 'INR',
      'symbol',
      '1.2-2'
    ) || '';
  }
}
