import { CategoryService } from '@/app/core/service/category.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-productcategorydetails',
    standalone: true,
    imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './productcategorydetails.component.html',
    styles: ``
})
export class ProductCategoryDetailsComponent {

   /* Inject Services */
    categoryGroupService = inject(ProductGroupService);
    categoryService = inject(CategoryService);
  
    constructor() {
      this.loadProductCategoryGroup();
    }
  
    /* Get Categories */
    lstProductGroup: any = [];
    loadProductCategoryGroup() {
      this.categoryGroupService.getCategoryGroups().subscribe({
        next: (CatResponse) => {
          var Sno = 1;
          for (let cat of CatResponse) {
            this.lstProductGroup.push({ sno: Sno++, groupid: cat.groupid, groupname: cat.groupname, imagepath: cat.imagepath });
          }

          if(this.lstProductGroup.length > 0){
            /* Load Product Categories for the first Group by default */
            this.loadProductCategoriesByGroupID(this.lstProductGroup[0].groupid);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

    /* Get Product Categories Based on Group ID */
     lstProductCategory: any = [];
    loadProductCategoriesByGroupID(groupID: number) {
      this.lstProductCategory = [];
      this.categoryService.getCategory(groupID).subscribe({
        next: (CatResponse) => {
          var Sno = 1;
          for (let cat of CatResponse) {
            this.lstProductCategory.push({ sno: Sno++, categoryid: cat.categoryid, categoryname: cat.categoryname });
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
 
}
