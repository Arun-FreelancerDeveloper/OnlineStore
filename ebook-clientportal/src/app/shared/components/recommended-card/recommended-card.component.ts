import {
  Component,
  OnInit,
  ViewChild,
  inject,
  TrackByFunction
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { RecommendedService } from '../../../core/services/insights/recommended/recommended.service';
import { RecommendedProductModel } from '../../../core/models/insights/recommended/recommended.model';
import { RecommendedProductCardComponent } from '../product-with-feature-card/product-with-feature-card.component'

@Component({
  selector: 'app-recommended-card',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, RecommendedProductCardComponent],
  templateUrl: './recommended-card.component.html'
})
export class RecommendedCardComponent implements OnInit {

  private RecommendedService = inject(RecommendedService);

  recommendedProducts: RecommendedProductModel[] = [];

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  page = 1;
  pageSize = 20;

  ngOnInit(): void {
    this.loadRecommended();
  }

  loadRecommended(): void {
    this.RecommendedService.getRecommendedProducts(this.page, this.pageSize)
      .subscribe({
        next: (res) => {
          this.recommendedProducts = res.data.data;
        },
        error: err => console.error(err)
      });
  }

  prevSlide() {
    this.slickModal.slickPrev();
  }

  nextSlide() {
    this.slickModal.slickNext();
  }

  trackByProductId: TrackByFunction<RecommendedProductModel> =
    (_, item) => item.productid;

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 1200,
    dots: false,
    arrows: true,
    infinite: true,
    responsive: [
      { breakpoint: 1399, settings: { slidesToShow: 5 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 575, settings: { slidesToShow: 2 } }
    ]
  };
}
