import { Route } from '@angular/router'
import { ProductDetailsComponent } from './details/productdetails.component'
import { ProductComponent } from './entryform/product.component'


export const PRODUCT_ROUTES: Route[] = [
  {
    path: 'details',
    component:  ProductDetailsComponent,
    data: { title: 'Details' },
  },
  {
     path: 'add',
    component: ProductComponent,
    data: { title: 'Add' },
  }
]
