import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecommendedProductModel } from '../../../core/models/insights/recommended/recommended.model';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { CartFacadeService } from '../../../core/facades/cart-facade.service';

@Component({
  selector: 'app-recommended-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CurrencyPipe],  // <-- Add this
  templateUrl: './product-with-feature-card.component.html',
})
export class RecommendedProductCardComponent {
  @Input() product!: RecommendedProductModel;
  @Input() isVender: boolean = false;

  mrpPrice: string = '';
  dealPrice: string = '';
  constructor(private currencyService: CurrencyService, private currencyPipe: CurrencyPipe, private cartFacade: CartFacadeService) { }


  ngOnInit() {
    this.currencyService.currency$.subscribe(currency => {

      // ✅ Convert MRP
      const convertedMrp = this.currencyService.convertPrice(
        this.product.mrp || 0,   // INR from DB
        currency
      );

      // ✅ Convert Deal Price
      const convertedDeal = this.currencyService.convertPrice(
        this.product.displayprice || 0, // INR from DB
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
    const soldPercentage = (this.product.total_sold || 0) / (this.product.total_stock ? this.product.total_stock : ((this.product.total_sold || 0) + 1)) * 100;
    const totalSold = this.product.total_sold || 0;
    const mrp = this.product.mrp || 0;
    const price = this.product.displayprice || 0;


    if (totalSold >= 100) {
      return 'best seller';
    }

    if ((this.product.recommendation_score || 0) >= 20) {
      return 'recommended';
    }

    if (mrp > price && ((mrp - price) / mrp) * 100 > 20) {
      return 'hot deal'; // big discount
    }

    if (totalSold < 10) {
      return 'new arrival';
    }
    return '';
  }

  addToCart(productId: number) {
    this.cartFacade.addToCart(productId, 1);
  }
}
