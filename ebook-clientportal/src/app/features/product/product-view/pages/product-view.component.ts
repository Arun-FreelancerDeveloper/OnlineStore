import { Component, HostListener,  OnInit } from '@angular/core';
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

@Component({
  selector: 'app-product-view',
  standalone: true,
  templateUrl: './product-view.component.html',
  styleUrl : './product-view.component.css',
  imports: [BreadcrumbComponent, CategoryGroupCarouselComponent, CommonModule, ProductCardComponent, SlickCarouselModule, RecommendedProductCardComponent, ShoppingCardComponent]
})
export class ProductViewComponent implements OnInit {

  groupId!: number;
  GroupName: string = 'Products Group';
  categoryId!: number;
  categoryName: string = '';
  category: any[] = [];
  products: ProductModel[] = [];
  cdr: any;

  /* Paggingation */
  page: number = 1;
  pageSize: number = 8;
  totalpageSize: number = 8;
  loading: boolean = false;
  hasMore: boolean = true;
  viewMode = signal<'grid' | 'list'>('grid');
quantity: number = 1;

 productImageSlider = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.product-details__thumb-slider',
    dots: false,
    arrows: false,
    focusOnSelect: true
  };

  thumbsImages = [
    'assets/images/icon/product-1.png',
    'assets/images/thumbs/product-details-thumb2.png',
    'assets/images/thumbs/product-details-thumb3.png',
    'assets/images/thumbs/product-details-thumb1.png',
    'assets/images/thumbs/product-details-thumb2.png',
  ];
productThumbSlider = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.product-details__images-slider'
  };

images = [
    'assets/images/icon/product-1.png',
    'assets/images/icon/product-1.png',
    'assets/images/icon/product-1.png',
    'assets/images/icon/product-1.png',
    'assets/images/icon/product-1.png',
  ];


arrivalSlider = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
    nextArrow: '#new-arrival-next',
    prevArrow: '#new-arrival-prev',
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 6,
          arrows: false,
        }
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
          arrows: false,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      },
    ]
  }

  /* =====================================================
   * QTY CONTROLS
   * ===================================================== */

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /* =====================================================
   * ADD TO CART
   * ===================================================== */

  addToCart(productId: number): void {

  }



  constructor(
    private route: ActivatedRoute,
    private ProductViewService: ProductViewService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const groupIdParam = params.get('groupId');
      this.resetPage();
      // ==========================================================================
      // ✅ CASE 1: load that group's categories/products
      // ==========================================================================
      if (groupIdParam) {
        this.groupId = Number(groupIdParam);
        this.loadCategoriesAndProducts();
      }

      // ==========================================================================
      // ❗ CASE 2: Automatically load first available groupId and its data
      // ==========================================================================
      else {
        this.loadFirstGroup();
      }
    });
  }

  /* ===================== VIEW MODE ===================== */
  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }
  setGridView(): void { this.viewMode.set('grid'); }
  setListView(): void { this.viewMode.set('list'); }

  // ==========================================================================
  // RESET THE PAGE
  // ==========================================================================
  resetPage() {
    this.products = [];
    this.page = 1;
    this.totalpageSize = 1;
    this.hasMore = true;
  }

  // ==========================================================================
  // LOAD FIRST GROUP
  // ==========================================================================
  loadFirstGroup() {
    this.categoryService.getCategoryGroups(7, 1, 100)
      .subscribe(categories => {
        this.category = categories;
        if (categories.length > 0) {
          this.groupId = categories[0].groupid;
          this.GroupName = categories[0].groupname;
          this.categoryId = categories[0].categoryid;
          this.loadProducts();
        }
      });
  }

  // =====================================================
  // LOAD CATEGORY + PRODUCTS
  // =====================================================
  loadCategoriesAndProducts() {
    this.categoryService.getCategoryGroups(this.groupId, 1, 100)
      .subscribe(categories => {
        this.category = categories;
        if (categories.length > 0) {
          // 👉 pick first category in that group
          this.groupId = categories[0].groupid;
          this.GroupName = categories[0].groupname;
          this.categoryId = categories[0].categoryid;
          this.loadProducts();
        }
      });
  }

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================
  // ✅ 👉 WRITE HERE (inside class)
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    // ✅ 80% scroll
    const threshold = document.body.offsetHeight * 0.5;
    if (scrollPosition >= threshold ) {
      this.loadNextPage();
    }
  }

  loadNextPage() {
    if (this.loading || !this.hasMore) return;
    this.page++;
    this.loadProducts();
  }
  onClickCategory(categoryId: number) {
    this.categoryId = categoryId;
    this.resetPage();
    this.loadProducts();
  }
  loadProducts() {
    if (this.loading || !this.hasMore || (this.totalpageSize == this.products.length) || typeof this.categoryId === "undefined") return;
    this.loading = true;
    this.ProductViewService.getProducts(this.categoryId, this.page, this.pageSize)
      .subscribe(res => {
        if (res.data.totalRecords != 0) {
          this.totalpageSize = res.data.totalRecords;
        }
        const newProducts = res.data || res;
        if (newProducts.pageSize < this.pageSize) {
          this.hasMore = false; // no more data
        }
        this.products = [...this.products, ...newProducts.data]; // 🔥 append
        this.loading = false;
      });
  }


}

