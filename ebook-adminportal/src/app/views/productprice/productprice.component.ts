import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { CategoryService } from '@/app/core/service/category.service';
import { ProductService } from '@/app/core/service/product.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
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
    selector: 'app-productprice',
    standalone : true,
    imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './productprice.component.html',
    styles: ``
})
export class ProductPriceComponent {
/* Inject Services */
        categoryGroupService = inject(ProductGroupService);
        categoryService = inject(CategoryService);
        productService = inject(ProductService);
  
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
        this.lstProduct = [];
        this.categoryService.getCategories(groupID).subscribe({
          next: (categories) => {
            var Sno = 1;
            for (let cat of categories) {
              this.lstProductCategory.push({ sno: Sno++, categoryid: cat.categoryid, categoryname: cat.categoryname });
              
            }
            if(this.lstProductCategory.length > 0){
              /* Load Products for the first Category by default */
              this.loadProductsByCategoryID(this.lstProductCategory[0].categoryid);
            }
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
   lstProduct: any = [];
   loadProductsByCategoryID(categoryID: number) {
        this.lstProduct = [];
        this.productService.getProducts(categoryID).subscribe({
          next: (ProdResponse) => {
            var Sno = 1;
            for (let prod of ProdResponse) {
              this.lstProduct.push({ sno: Sno++, productid: prod.productid, productcode: prod.productcode, productname: prod.productname });
            }
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
 
}
