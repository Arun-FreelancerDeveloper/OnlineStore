import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart/cart.service';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-cart-list',
  standalone: true,
  templateUrl: './cart-list.component.html',
  imports: [BreadcrumbComponent]
})
export class CartListComponent implements OnInit {

  products: any[] = [];
  isLoading = false;

  subtotal = 0;
  tax = 0;
  total = 0;

  userId = 1; // 🔥 replace with logged-in user

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  // ================= LOAD CART =================
  loadCart() {
    this.isLoading = true;

    this.cartService.getCartItems(this.userId).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.calculateTotals();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // ================= TRACK BY =================
  trackByProduct(index: number, item: any) {
    return item.cartid;
  }

  // ================= QTY CHANGE =================
  onQtyChange(product: any) {
    product.amount = product.qty * product.displayprice;
    this.calculateTotals();
  }

  // ================= REMOVE =================
  removeProduct(cartid: number) {
    this.cartService.removeItem(cartid, this.userId).subscribe(() => {
      this.products = this.products.filter(p => p.cartid !== cartid);
      this.calculateTotals();
    });
  }

  // ================= UPDATE CART =================
  updateCart() {
    const payload = {
      modifiedby: this.userId,
      items: this.products.map(p => ({
        cartid: p.cartid,
        qty: p.qty
      }))
    };

    this.cartService.updateCartItems(payload).subscribe(() => {
      console.log('Cart updated');
    });
  }

  // ================= TOTAL CALC =================
  calculateTotals() {
    this.subtotal = this.products.reduce(
      (sum, p) => sum + (p.qty * p.displayprice),
      0
    );

    this.tax = this.subtotal * 0.05; // 5% tax
    this.total = this.subtotal + this.tax;
  }
}
