import { Component, HostListener,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProductService } from '../services/product.service';
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
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl : './product-list.component.css',
  imports: [BreadcrumbComponent, CategoryGroupCarouselComponent, CommonModule, ProductCardComponent, SlickCarouselModule, ShoppingCardComponent]
})
export class ProductListComponent implements OnInit {

  groupId!: number;
  GroupName: string = 'Products Group';
  categoryId!: number;
  categoryName: string = '';
  category: any[] = [];
  products: ProductModel[] = [];
  searchQuery = '';
  isSearchMode = false;
  cdr: any;

  /* Paggingation */
  page: number = 1;
  pageSize: number = 8;
  totalpageSize: number = 8;
  loading: boolean = false;
  hasMore: boolean = true;
  viewMode = signal<'grid' | 'list'>('grid');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .subscribe(([params, query]) => {
        const groupIdParam = params.get('groupId');
        this.searchQuery = query.get('search')?.trim() ?? '';
        this.isSearchMode = this.searchQuery.length > 0;
        this.resetPage();

        if (groupIdParam) {
          this.groupId = Number(groupIdParam);
          this.loadCategoriesAndProducts();
        } else {
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
    const request$ = this.isSearchMode
      ? this.productService.getProducts(0, this.page, this.pageSize, this.searchQuery)
      : this.productService.getProducts(this.categoryId, this.page, this.pageSize);

    request$.subscribe(res => {
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
