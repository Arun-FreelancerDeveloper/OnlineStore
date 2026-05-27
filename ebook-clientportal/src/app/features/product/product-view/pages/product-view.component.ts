/**
 * ProductViewComponent renders the product detail page.
 * It handles product lookup, quantity selection, currency formatting, and add-to-cart actions.
 */
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { ProductViewService } from '../services/product-view.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { CategoryGroupCarouselComponent } from "../../../../shared/components/categorygroup/categorygroup.component";
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";
import { ProductModel } from '../../../../core/models/product/product.model';
import { RecommendedProductCardComponent } from "../../../../shared/components/product-with-feature-card/product-with-feature-card.component";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { signal } from '@angular/core';
import { ShoppingCardComponent } from "../../../../shared/components/shopping-card/shopping-card.component";
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-view',
  standalone: true,
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css',
  imports: [BreadcrumbComponent, CommonModule, SlickCarouselModule, FormsModule],
  providers: [CurrencyPipe]
})

export class ProductViewComponent implements OnInit {

  productId!: number;
  productName: string = '';
  productDisplaymrpPrice: string = '';
  productDisplaydealPrice: string = '';
  product: ProductModel | null = null;
  quantity: number = 1;

  @ViewChild('mainSlider') mainSlider!: SlickCarouselComponent;

  mainSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    infinite: true
  };

  thumbSliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    focusOnSelect: true
  };

  // 👉 Click thumbnail → change main image
  goToSlide(index: number) {
    this.mainSlider.slickGoTo(index);
  }

  // 👉 Image fallback (extra safety)
  onImgError(img: any) {
    img.imagepath = `/images/default.jpg`;
  }

  constructor(
    private route: ActivatedRoute,
    private ProductViewService: ProductViewService,
    private currencyService: CurrencyService,
    private currencyPipe: CurrencyPipe,
    private cartFacade: CartFacadeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productIdParam = params.get('productId');
      /* ========================================================================== */
      /* ✅ CASE 1: load that product */
      /* ========================================================================== */
      this.quantity = 1; // reset quantity on product change
      if (productIdParam) {
        this.productId = Number(productIdParam);
        this.getProduct(this.productId);
      }
    });
  }

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================
  getProduct(productId: number) {
    this.ProductViewService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.productName = product.productname;

        // ✅ Apply currency conversion
        this.currencyService.currency$.subscribe(currency => {

          const convertedMrp = this.currencyService.convertPrice(
            product.mrp,
            currency
          );

          const convertedDeal = this.currencyService.convertPrice(
            product.displayprice,
            currency
          );

          this.productDisplaymrpPrice = this.currencyPipe.transform(
            convertedMrp,
            currency,
            'symbol',
            '1.2-2'
          ) || '';

          this.productDisplaydealPrice = this.currencyPipe.transform(
            convertedDeal,
            currency,
            'symbol',
            '1.2-2'
          ) || '';
        });

      },
      error: (error) => {
        console.error('Error fetching product:', error);
      }
    });
  }

  // ➕ Increase
  increaseQty() {
    this.quantity++;
  }

  // ➖ Decrease
  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // 🛒 Add to Cart
  addToCart() {
    this.cartFacade.addToCart(this.productId, this.quantity);
  }

}
