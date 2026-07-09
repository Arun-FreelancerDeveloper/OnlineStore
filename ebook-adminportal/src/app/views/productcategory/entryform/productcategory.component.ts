import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '@/app/core/service/category.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';

@Component({
  selector: 'app-productcategory',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './productcategory.component.html',
  styles: ``
})
export class ProductCategoryComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private groupService = inject(ProductGroupService);
  private alert = inject(SweetAlertService);
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);

  productCategoryForm: UntypedFormGroup;
  lstProductGroup: any[] = [];
  loading = false;

  isEditMode = false;
  categoryId!: number;

  constructor() {
    this.productCategoryForm = this.fb.group({
      groupId: [null, Validators.required],
      categoryName: ['', Validators.required],
      imagepath: ''
    });
     this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.categoryId) {
      this.isEditMode = true;
      this.loadCategoryDetails();
    }
  }

  /* ----------------------------------
   * LOAD Category FOR EDIT
   * ---------------------------------- */
  loadCategoryDetails(): void {
    this.loading = true;

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.productCategoryForm.patchValue({
          groupId: category.groupid,
          categoryId: category.categoryid,
          categoryName: category.categoryname,
          imagepath : category.imagepath
        });
        this.loading = false;
      },
      error: () => {
        this.alert.error(
          'Unable to load product category  ',
          'Please try again.'
        );
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadProductGroups();
  }

  loadProductGroups(): void {
    this.groupService.getCategoryGroups().subscribe({
      next: (groups) => {
        this.lstProductGroup = groups;
      },
      error: () => {
        this.alert.error('Unable to load groups', 'Please try again later.');
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.productCategoryForm.patchValue({ image: input.files[0] });
    }
  }

  saveCategory(): void {
    if (this.productCategoryForm.invalid) {
      this.alert.warning('Please select a group and enter a category name.');
      return;
    }

    this.loading = true;

    const payload = {
      groupId: this.productCategoryForm.value.groupId,
      categoryName: this.productCategoryForm.value.categoryName.trim(),
      createdBy: 1,
      imagepath: this.productCategoryForm.value.imagepath
    };

    this.categoryService.createCategory(payload).subscribe({
      next: () => {
        this.alert.success('Category created', 'The category has been saved successfully.');
        this.productCategoryForm.reset();
        this.loading = false;
        this.router.navigate(['/productcategory/details']);
      },
      error: () => {
        this.loading = false;
        this.alert.error('Unable to save category', 'Please try again.');
      }
    });
  }
}
