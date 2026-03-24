import {
  Component,
  OnInit,
  ViewChild,
  inject,
  TrackByFunction
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

import { FlashSaleService } from '../../../core/services/insights/flashsale/flashsale.service';
import { FlashSaleProductModel } from '../../../core/models/insights/flashsale/flashsale.model';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-flashsale-card',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, ProductCardComponent],
  templateUrl: './flashsale-card.component.html'
})
export class FlashSaleCardComponent implements OnInit {

  private flashSaleService = inject(FlashSaleService);

  flashProducts: FlashSaleProductModel[] = [];

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  page = 1;
  pageSize = 100;

  ngOnInit(): void {
    this.loadFlashSale();
  }

  loadFlashSale(): void {
    this.flashSaleService.getFlashSaleProducts(this.page, this.pageSize)
      .subscribe({
        next: (res) => {
          this.flashProducts = res.data.data;
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

  trackByProductId: TrackByFunction<FlashSaleProductModel> =
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
