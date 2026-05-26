import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '@/app/core/service/order.service';
import { Order } from '@/app/core/models/order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order!: Order;
  loading = true;

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe(res => {
        debugger;
        this.order = res;
        this.loading = false;
      });
    }
  }

  get totalAmount(): number {
    return this.order?.items?.reduce(
      (sum, i) => sum + i.totalprice, 0
    ) || 0;
  }
}
