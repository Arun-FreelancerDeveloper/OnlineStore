import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CategoryService } from '@/app/core/service/category.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';

@Component({
  selector: 'app-productcategory',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './productcategory.component.html',
  styles: ``
})
export class ProductCategoryComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private groupService = inject(ProductGroupService);
  private alert = inject(SweetAlertService);
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productCategoryForm: UntypedFormGroup;
  lstProductGroup: any[] = [];

  loading = false;

  isEditMode = false;
  categoryId!: number;

  constructor() {

    this.productCategoryForm = this.fb.group({
      groupId: [null, Validators.required],
      categoryName: ['', Validators.required],
      image: [null],
      imagepath: ['']
    });

    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.categoryId) {
      this.isEditMode = true;
    }
  }

  ngOnInit(): void {
    this.loadProductGroups();

    if (this.isEditMode) {
      this.loadCategoryDetails();
    }
  }

  loadProductGroups(): void {
    this.groupService.getCategoryGroups().subscribe({
      next: (groups) => {
        this.lstProductGroup = groups;
      },
      error: () => {
        this.alert.error(
          'Unable to load groups',
          'Please try again later.'
        );
      }
    });
  }

  loadCategoryDetails(): void {

    this.loading = true;

    this.categoryService.getCategoryById(this.categoryId).subscribe({

      next: (category) => {

        this.productCategoryForm.patchValue({
          groupId: category.groupid,
          categoryName: category.categoryname,
          imagepath: category.imagepath
        });

        this.loading = false;
      },

      error: () => {

        this.loading = false;

        this.alert.error(
          'Unable to load category',
          'Please try again.'
        );
      }

    });

  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.productCategoryForm.patchValue({
        image: input.files[0]
      });

    }

  }

  saveCategory(): void {

    if (this.productCategoryForm.invalid) {

      this.alert.warning(
        'Please select a group and enter a category name.'
      );

      return;

    }

    this.loading = true;

    const payload = {

      groupId: this.productCategoryForm.value.groupId,
      categoryName: this.productCategoryForm.value.categoryName.trim(),
      createdBy: 1,
      image: this.productCategoryForm.value.image

    };

    this.categoryService.createCategory(payload).subscribe({

      next: () => {

        this.loading = false;

        this.alert.success(
          'Category created',
          'The category has been saved successfully.'
        );

        this.router.navigate(['/productcategory/details']);

      },

      error: () => {

        this.loading = false;

        this.alert.error(
          'Unable to save category',
          'Please try again.'
        );

      }

    });

  }

}
