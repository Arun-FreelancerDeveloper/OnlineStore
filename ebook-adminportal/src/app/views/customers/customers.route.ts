import { Route } from '@angular/router'
import { CustomerDetailsComponent } from './details/customerdetails.component'

export const CUSTOMER_ROUTES: Route[] = [
  {
    path: 'details',
    component:  CustomerDetailsComponent,
    data: { title: 'Details' },
  }
]
