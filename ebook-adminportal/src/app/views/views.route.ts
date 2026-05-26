import { Route } from '@angular/router'

export const VIEW_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboards/dashboards.route').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'productgroup',
    loadChildren: () =>
      import('./productgroup/productgroup.route').then(
        (mod) => mod.PRODUCTGROUP_ROUTES
      ),
  },
  {
    path: 'productcategory',
    loadChildren: () =>
      import('./productcategory/productcategory.route').then(
        (mod) => mod.PRODUCTCATEGORY_ROUTES
      ),

  },
   {
    path: 'product',
    loadChildren: () =>
      import('./product/product.route').then(
        (mod) => mod.PRODUCT_ROUTES
      ),

  },
  {
    path: 'productprice',
    loadChildren: () =>
      import('./productprice/productprice.route').then(
        (mod) => mod.PRODUCTPRICE_ROUTES
      ),

  },
  {
    path: 'productstock',
    loadChildren: () =>
      import('./productstock/productstock.route').then(
        (mod) => mod.PRODUCTSTOCK_ROUTES
      ),

  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./order/order.route').then(
        (mod) => mod.ORDER_ROUTES
      ),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/customers.route').then(
        (mod) => mod.CUSTOMER_ROUTES
      ),
  }
]
