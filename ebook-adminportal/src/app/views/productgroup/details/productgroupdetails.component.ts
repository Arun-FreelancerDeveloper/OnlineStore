import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-productgroupdetails',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './productgroupdetails.component.html'
})
export class ProductGroupDetailsComponent {

  /* Inject Services */
  categoryGroupService = inject(ProductGroupService);
  alert = inject(SweetAlertService);
  router = inject(Router);

  lstProductGroup: any[] = [];
  searchText = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;

  constructor() {
    this.loadProductCategoryGroup();
  }

  /* Get Categories */
  loadProductCategoryGroup(page = 1) {
    this.currentPage = page;
    this.lstProductGroup = [];

    this.categoryGroupService.getAllCategoryGroups(page, this.pageSize, this.searchText).subscribe({
      next: (res) => {
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;

        let Sno = ((page - 1) * this.pageSize) + 1;
        for (let cat of res.data) {
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

  searchGroups() {
    this.loadProductCategoryGroup(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.loadProductCategoryGroup(page);
  }

  getPageNumbers(): number[] {
    if (this.totalPages <= 1) {
      return [1];
    }

    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
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
