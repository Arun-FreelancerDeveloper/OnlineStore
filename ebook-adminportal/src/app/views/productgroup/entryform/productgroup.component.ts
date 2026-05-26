import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-productgroup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './productgroup.component.html'
})
export class ProductGroupComponent {

  private productGroupService = inject(ProductGroupService);
  private alert = inject(SweetAlertService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productGroupForm: FormGroup;
  loading = false;

  isEditMode = false;
  groupId!: number;

  constructor() {
    this.productGroupForm = this.fb.group({
      groupName: ['', Validators.required]
    });

    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.groupId) {
      this.isEditMode = true;
      this.loadGroupDetails();
    }
  }

  /* ----------------------------------
   * LOAD GROUP FOR EDIT
   * ---------------------------------- */
  loadGroupDetails(): void {
    this.loading = true;

    this.productGroupService.getCategoryGroupById(this.groupId).subscribe({
      next: (group) => {
        this.productGroupForm.patchValue({
          groupName: group.groupname
        });
        this.loading = false;
      },
      error: () => {
        this.alert.error(
          'Unable to load product group',
          'Please try again.'
        );
        this.loading = false;
      }
    });
  }

  /* ----------------------------------
   * SAVE / UPDATE
   * ---------------------------------- */
  saveCategoryGroup(): void {

    if (this.productGroupForm.invalid) {
      this.alert.warning('Please enter a group name');
      return;
    }

    this.loading = true;

    const payload = {
      groupName: this.productGroupForm.value.groupName.trim(),
      createdBy: 1
    };

    if (this.isEditMode) {
      // 🔹 UPDATE
      this.productGroupService
        .updateCategoryGroup(this.groupId, payload)
        .subscribe({
          next: () => {
            this.alert.success(
              '',
              'Your changes have been saved.'
            );
            this.router.navigate(['/productgroup/list']);
          },
          error: () => {
            this.alert.error(
              'Update failed',
              'Please try again.'
            );
            this.loading = false;
          }
        });
    } else {
      // 🔹 CREATE
      this.productGroupService.createCategoryGroup(payload).subscribe({
        next: () => {
          this.alert.success(
            'Product group added',
            'Your new product group has been added successfully.'
          );
          this.productGroupForm.reset();
          this.loading = false;
        },
        error: () => {
          this.alert.error(
            'Unable to add product group',
            'Please try again.'
          );
          this.loading = false;
        }
      });
    }
  }
}
