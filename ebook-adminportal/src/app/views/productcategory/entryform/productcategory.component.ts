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
    selector: 'app-productcategory',
    imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './productcategory.component.html',
    styles: ``
})
export class ProductCategoryComponent {

  lstProductGroup: any = [
      { id: 1, sno : 1, groupname: 'General Books' },
      { id: 2, sno : 2, groupname: 'Text Books' },
      { id: 3, sno : 3, groupname: 'Stationary' },
      { id: 4, sno : 4, groupname: 'Furniture' },
      { id: 5, sno : 5, groupname: 'E-Books' },
      { id: 6, sno : 6, groupname: 'Toys' },
      { id: 7, sno : 7, groupname: 'Arts & Crafts' },
      { id: 8, sno : 8, groupname: 'Clothing' },
      { id: 9, sno : 9, groupname: 'Electronics' },
      { id: 10, sno : 10, groupname: 'Digital Gift Cards' }
    ];

  constructor() {

    

  }
 
}
