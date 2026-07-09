import { CategoryService } from '@/app/core/service/category.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-productcategorydetails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './productcategorydetails.component.html',
  styles: ``
})
export class ProductCategoryDetailsComponent implements OnInit {

  categoryGroupService = inject(ProductGroupService);
  categoryService = inject(CategoryService);
  alert = inject(SweetAlertService);
    router = inject(Router);

  lstProductGroup: any[] = [];
  lstProductCategory: any[] = [];
  selectedGroupId: number | null = null;
  isLoading = false;


  ngOnInit(): void {
    this.loadProductCategoryGroup();
  }

  loadProductCategoryGroup(): void {
    this.lstProductGroup = [];
    this.categoryGroupService.getCategoryGroups().subscribe({
      next: (groups) => {
        this.lstProductGroup = groups;

        if (this.lstProductGroup.length > 0) {
          this.selectedGroupId = this.lstProductGroup[0].groupid;
          if (this.selectedGroupId !== null) {
            this.loadProductCategoriesByGroupID(this.selectedGroupId);
          }
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
    this.isLoading = true;

    this.categoryService.getCategories(groupID).subscribe({
      next: (categories) => {
        this.lstProductCategory = categories.map((cat, index) => ({
          sno: index + 1,
          categoryid: cat.categoryid,
          categoryname: cat.categoryname
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alert.error('Unable to load categories', 'Please try again later.');
      }
    });
  }

  // Edit
  editCategory(categoryId: number): void {
   this.router.navigate(['/productcategory/edit', categoryId]);
    
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId, 1).subscribe({
      next: () => {
        this.alert.success('Deleted', 'Category has been removed.');
        if (this.selectedGroupId !== null) {
          this.loadProductCategoriesByGroupID(this.selectedGroupId);
        }
      },
      error: () => {
        this.alert.error('Unable to delete category', 'Please try again.');
      }
    });
  }


}
