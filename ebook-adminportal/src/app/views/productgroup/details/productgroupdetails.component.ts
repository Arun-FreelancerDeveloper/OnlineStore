import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-productgroupdetails',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './productgroupdetails.component.html'
})
export class ProductGroupDetailsComponent {

  /* Inject Services */
  categoryGroupService = inject(ProductGroupService);
  alert = inject(SweetAlertService);
  router = inject(Router);

  lstProductGroup: any[] = [];

  constructor() {
    this.loadProductCategoryGroup();
  }

  /* Get Categories */
  loadProductCategoryGroup() {
    this.lstProductGroup = []; // ✅ clear before reload

    this.categoryGroupService.getCategoryGroups().subscribe({
      next: (res) => {
        let Sno = 1;
        for (let cat of res) {
          this.lstProductGroup.push({
            sno: Sno++,
            groupid: cat.groupid,
            groupname: cat.groupname,
            imagepath: cat.imagepath
          });
        }
      },
      error: (err) => console.error(err)
    });
  }

  /* Edit */
  editGroup(groupId: number) {
    this.router.navigate(['/productgroup/edit', groupId]);
  }


  /* Delete */
  async deleteGroup(groupId: number) {

    const confirmed = await this.alert.confirm(
      'Are you sure you want to delete this product group?',
      ''
    );

    if (!confirmed) return;

    this.categoryGroupService.deleteCategoryGroup(groupId, 1).subscribe({
      next: () => {
        this.alert.success(
          '',
          'The product group has been removed successfully.'
        );
        this.loadProductCategoryGroup();
      },
      error: () => {
        this.alert.error(
          'Unable to remove product group',
          'Please try again later or contact support if the problem continues.'
        );
      }
    });
  }
}
