import { Route } from '@angular/router'
import { ProductStockComponent } from './productstock.component'


export const PRODUCTSTOCK_ROUTES: Route[] = [
  {
    path: 'details',
    component: ProductStockComponent,
    data: { title: 'Details' },
  },
]
