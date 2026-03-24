import { Component, EventEmitter, Output, OnInit, ViewChild, inject, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { Router } from '@angular/router';
import { CategoryGroupService } from '../../../core/services/category-group/category-group.service';
import { CategoryGroupModel } from '../../../core/models/categorygroup/category-group.model';
import { ConfigService } from '../../../core/config/config.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-categorygroup-carousel',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './categorygroup.component.html',
})
export class CategoryGroupCarouselComponent implements OnInit {

  private categoryService = inject(CategoryGroupService);
  private appConfigService = inject(ConfigService);
  private router = inject(Router);

  @Output() groupSelected = new EventEmitter<number>();

  lstCategoryGroups: CategoryGroupModel[] = [];

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  // Pagination
  currentPage: number = 1;
  limit: number = 20;
  trackByGroup!: TrackByFunction<CategoryGroupModel>;


  ngOnInit(): void {
    this.loadCategoryGroups();
  }

  loadCategoryGroups(): void {
    this.categoryService.getCategoryGroups(this.currentPage, this.limit).subscribe({
      next: (data: CategoryGroupModel[]) => {
        // Only show groups with active categories
        this.lstCategoryGroups = data
          .filter(g => g.activecategorycount > 0)
          .map(g => ({
            groupid: g.groupid,
            groupname: g.groupname,
            imagepath: `${this.appConfigService.api.imageUrl}/${g.imagepath}`,
            activecategorycount: g.activecategorycount
          }));
      },
      error: err => console.error('Failed to load category groups', err)
    });
  }

  loadCategoriesByGroupID(groupId: number, groupName: string) {
    this.groupSelected.emit(groupId);
    this.router.navigate(['/products', groupId]);
  }

  // Navigation buttons
  prevSlide(): void {
    this.slickModal.slickPrev();
  }

  nextSlide(): void {
    this.slickModal.slickNext();
  }

  // TrackBy for ngFor
  trackByGroupId(index: number, item: CategoryGroupModel): number {
    return item.groupid;
  }

  // Slick carousel config
  CategoryGroupSlideConfig = {
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    arrows: false, // we use custom buttons
    draggable: true,
    infinite: true,
    responsive: [
      { breakpoint: 1399, settings: { slidesToShow: 6 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 575, settings: { slidesToShow: 2 } }
    ]
  };
}
