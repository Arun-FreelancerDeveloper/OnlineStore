import { Route } from '@angular/router'
import { ProductPriceComponent } from './productprice.component'


export const PRODUCTPRICE_ROUTES: Route[] = [
  {
    path: 'details',
    component: ProductPriceComponent,
    data: { title: 'Details' },
  },
]
