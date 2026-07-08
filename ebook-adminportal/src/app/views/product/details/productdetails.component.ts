import { CategoryService } from '@/app/core/service/category.service';
import { ProductService } from '@/app/core/service/product.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './productdetails.component.html',
  styles: ``
})
export class ProductDetailsComponent implements OnInit {

  private router = inject(Router);
  private alert = inject(SweetAlertService);
  private categoryGroupService = inject(ProductGroupService);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  lstProductGroup: any[] = [];
  lstProductCategory: any[] = [];
  lstProduct: any[] = [];
  selectedGroupId: number | null = null;
  selectedCategoryId: number | null = null;
  searchText = '';
  isLoading = false;

  ngOnInit(): void {
    this.loadProductCategoryGroup();
  }

  loadProductCategoryGroup(): void {
    this.lstProductGroup = [];
    this.categoryGroupService.getCategoryGroups().subscribe({
      next: (groups) => {
        this.lstProductGroup = groups;
        if (groups.length > 0) {
          this.selectedGroupId = groups[0].groupid;
          this.loadProductCategoriesByGroupID(this.selectedGroupId || 0);
        }
      },
      error: () => {
        this.alert.error('Unable to load groups', 'Please try again later.');
      }
    });
  }

  loadProductCategoriesByGroupID(groupID: number): void {
    this.selectedGroupId = groupID;
    this.lstProductCategory = [];
    this.lstProduct = [];

    this.categoryService.getCategories(groupID).subscribe({
      next: (categories) => {
        this.lstProductCategory = categories.map((cat, index) => ({
          sno: index + 1,
          categoryid: cat.categoryid,
          categoryname: cat.categoryname
        }));

        if (this.lstProductCategory.length > 0) {
          this.selectedCategoryId = this.lstProductCategory[0].categoryid;
          this.loadProductsByCategoryID(this.selectedCategoryId || 0);
        }
      },
      error: () => {
        this.alert.error('Unable to load categories', 'Please try again later.');
      }
    });
  }

  loadProductsByCategoryID(categoryID: number): void {
    this.selectedCategoryId = categoryID;
    this.lstProduct = [];
    this.isLoading = true;

    this.productService.getProducts(categoryID, 1, 100, this.searchText).subscribe({
      next: (products) => {
        this.lstProduct = products.map((prod, index) => ({
          sno: index + 1,
          productid: prod.productid,
          productcode: prod.productcode,
          productname: prod.productname
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alert.error('Unable to load products', 'Please try again later.');
      }
    });
  }

  searchProducts(): void {
    if (this.selectedCategoryId !== null) {
      this.loadProductsByCategoryID(this.selectedCategoryId);
    }
  }

  editProduct(productId: number): void {
    this.router.navigate(['/product/edit', productId]);
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId, 1).subscribe({
      next: () => {
        this.alert.success('Deleted', 'Product deleted successfully.');
        if (this.selectedCategoryId !== null) {
          this.loadProductsByCategoryID(this.selectedCategoryId);
        }
      },
      error: () => {
        this.alert.error('Unable to delete product', 'Please try again later.');
      }
    });
  }
}
