import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { CategoryGroupCarouselComponent } from "../../shared/components/categorygroup/categorygroup.component";
import { BannerComponent } from "../../shared/components/banner/banner.component";
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { ProductModel } from '../../core/models/product/product.model';
import { FlashSaleCardComponent } from "../../shared/components/flashsale-card/flashsale-card.component";
import { RecommendedCardComponent } from "../../shared/components/recommended-card/recommended-card.component";
import { DiscountCardComponent } from "../../shared/components/discount-card/discount-card.component";
import { NewsletterCardComponent } from "../../shared/components/newsletter-card/newsletter-card.component";
import { ShoppingCardComponent } from "../../shared/components/shopping-card/shopping-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BreadcrumbComponent, CategoryGroupCarouselComponent, BannerComponent, ProductCardComponent, FlashSaleCardComponent, RecommendedCardComponent, DiscountCardComponent, NewsletterCardComponent, ShoppingCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 isVender: boolean = false;
}
