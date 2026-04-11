import { RouterModule, Routes } from '@angular/router';

/* Import components Here */
import { HomeComponent } from '../app/pages/home/home.component';
import { ProductListComponent } from '../app/features/product/product-list/pages/product-list.component'
import { LoginComponent } from './features/account/pages/login/login.component';
import { RegistrationComponent } from './features/account/pages/registration/registration.component';
import { CartListComponent } from './features/cart/pages/cart-list/cart-list.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { RefundComponent } from './pages/refund/refund.component';
import { TermsconditionsComponent } from './pages/termsconditions/termsconditions.component';
import { ForgotPasswordComponent } from './features/account/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/account/pages/reset-password/reset-password.component';
import { CheckoutComponent } from './features/checkout/checkout/checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ProductViewComponent } from './features/product/product-view/pages/product-view.component';

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
    path: 'aboutus',
    component: AboutusComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'refund',
    component: RefundComponent
  },
  {
    path: 'termsconditions',
    component: TermsconditionsComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/:groupId',
    component: ProductListComponent
  },
  {
    path: 'productview/:productId',
    component: ProductViewComponent
  },
  {
    path: 'viewcart',
    component: CartListComponent
  },
  {
    path: 'signin',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: RegistrationComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'resetpassword/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'orders',
    component: OrderHistoryComponent
  },
];
export class AppRoutingModule { }
