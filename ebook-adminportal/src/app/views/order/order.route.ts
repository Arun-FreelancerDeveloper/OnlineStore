import { Route } from '@angular/router'

import { OrderComponent } from './entryform/order.component'
import { OrderDetailsComponent } from './details/orderdetails.component'


export const ORDER_ROUTES: Route[] = [
  {
    path: 'details',
    component:  OrderDetailsComponent,
    data: { title: 'Details' },
  },
  {
     path: 'add/:id',
    component: OrderComponent,
    data: { title: 'Add' },
  }
]
