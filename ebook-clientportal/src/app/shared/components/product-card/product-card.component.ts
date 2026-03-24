import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../../core/models/product/product.model';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { ConfigService } from '../../../core/config/config.service';
import { CartFacadeService } from '../../../core/facades/cart-facade.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CurrencyPipe],  // <-- Add this
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: ProductModel;
  @Input() isVender: boolean = false;

  mrpPrice: string = '';
  dealPrice: string = '';

  constructor(private currencyService: CurrencyService, private currencyPipe: CurrencyPipe, private config: ConfigService, private cartFacade: CartFacadeService) { }
  ngOnInit() {
    this.currencyService.currency$.subscribe(currency => {

      // ✅ Convert MRP
      const convertedMrp = this.currencyService.convertPrice(
        this.product.mrp,   // INR from DB
        currency
      );

      // ✅ Convert Deal Price
      const convertedDeal = this.currencyService.convertPrice(
        this.product.displayprice, // INR from DB
        currency
      );

      // ✅ Format with symbol
      this.mrpPrice = this.currencyPipe.transform(
        convertedMrp,
        currency,
        'symbol',
        '1.2-2'
      ) || '';

      this.dealPrice = this.currencyPipe.transform(
        convertedDeal,
        currency,
        'symbol',
        '1.2-2'
      ) || '';
    });
  }

  getDiscountPercentage(): number {
    if (!this.product.mrp || !this.product.displayprice) return 0;
    return Math.round(
      ((this.product.mrp - this.product.displayprice) / this.product.mrp) * 100
    );
  }

  getTag(): string {
    const insights = this.config.insights;
    const totalSold = this.product.total_sold || 0;
    const totalStock = this.product.total_stock || 0;
    const mrp = this.product.mrp || 0;
    const price = this.product.displayprice || 0;

    const soldPercentage =
      totalStock > 0
        ? (totalSold / totalStock) * 100
        : (totalSold / (totalSold + 1)) * 100;

    const discountPercentage =
      mrp > 0 ? ((mrp - price) / mrp) * 100 : 0;

    // 🔥 Use config instead of hardcoded values

    if (totalSold >= insights.bestSeller_MinSold) {
      return 'best seller';
    }

    if ((soldPercentage || 0) >= insights.recommendation_Percentage) {
      return 'recommended';
    }

    if (mrp > price && discountPercentage > insights.hotDeal_DiscountPercentage) {
      return 'hot deal';
    }

    if (totalSold < insights.newArrival_MaxSold) {
      return 'new arrival';
    }
    return '';
  }

  addToCart(productId: number) {
    this.cartFacade.addToCart(productId, 1);
  }
}
