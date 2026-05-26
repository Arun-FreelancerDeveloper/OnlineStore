import { Route } from '@angular/router';
import { ProductGroupDetailsComponent } from './details/productgroupdetails.component';
import { ProductGroupComponent } from './entryform/productgroup.component';

export const PRODUCTGROUP_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ProductGroupDetailsComponent,
    data: { title: 'Product Groups' }
  },
  {
    path: 'add',
    component: ProductGroupComponent,
    data: { title: 'Add Product Group' }
  },
  {
    path: 'edit/:id',
    component: ProductGroupComponent,
    data: { title: 'Edit Product Group' }
  }
];
