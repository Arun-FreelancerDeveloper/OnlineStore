import { RouterModule, Routes } from '@angular/router';

/* Import components Here */
import { HomeComponent } from '../app/pages/home/home.component';
import { ProductListComponent } from '../app/features/product/product-list/pages/product-list.component'
import { LoginComponent } from './features/account/pages/login/login.component';
import { RegistrationComponent } from './features/account/pages/registration/registration.component';
import { CartListComponent } from './features/cart/pages/cart-list/cart-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path : 'products',
    component : ProductListComponent
  },
  {
    path : 'products/:groupId',
    component : ProductListComponent
  },
  {
    path : 'viewcart',
    component : CartListComponent
  },
  {
    path: 'signin',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: RegistrationComponent
  }
];
export class AppRoutingModule {}
