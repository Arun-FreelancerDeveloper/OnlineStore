import { Route } from '@angular/router'

import { ProductCategoryComponent } from './entryform/productcategory.component'
import { ProductCategoryDetailsComponent } from './details/productcategorydetails.component'
import { ProductGroupComponent } from '../productgroup/entryform/productgroup.component'


export const PRODUCTCATEGORY_ROUTES: Route[] = [
  {
    path: 'details',
    component:  ProductCategoryDetailsComponent,
    data: { title: 'Details' },
  },
  {
     path: 'add',
    component: ProductCategoryComponent,
    data: { title: 'Add' },
  },
  {
      path: 'edit/:id',
      component:  ProductCategoryComponent,
      data: { title: 'Edit Product Category' }
    }
]
