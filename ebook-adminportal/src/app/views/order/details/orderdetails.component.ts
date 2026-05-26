import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderService } from '@/app/core/service/order.service';

@Component({
  selector: 'app-orderdetails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './orderdetails.component.html',
  styles: ``
})
export class OrderDetailsComponent implements OnInit {

  private router = inject(Router);
  private orderService = inject(OrderService);

  lstOrder: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.lstOrder = orders.map((o, index) => ({
          id: o.orderid,
          sno: index + 1,
          orderno: o.orderno,
          orderdate: new Date(o.orderdate).toLocaleDateString(),
          orderby: o.shippingname,
          totalamount: `$${o.totalamount}`,
          orderstatus: o.orderstatus,
          paymentstatus: o.paymentstatus
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigateByUrl(`/orders/add/${orderId}`);
  }
}
