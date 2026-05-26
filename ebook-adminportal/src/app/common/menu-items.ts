import { MenuItem } from '../core/models/menu.model'

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'main',
    label: 'Main Menu',
    isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'iconoir-home-simple',
    label: 'Dashboards',
    collapsed: false,
   
    url: '/dashboard/analytics',
    subMenu: [],
  },
   {
    key: 'Masters',
    icon: 'iconoir-hexagon-dice',
    label: 'Masters',
    collapsed: false,
    subMenu: [
      {
        key: 'productgroup',
        label: 'Product Group',
        url: '/productgroup/list',
        parentKey: 'Masters',
      },
      {
        key: 'productcategory',
        label: 'Product Category',
        url: '/productcategory/details',
        parentKey: 'Masters',
      },
      {
        key: 'product',
        label: 'Product',
        url: '/product/details',
        parentKey: 'Masters',
      },
    ],
  },
  {
    key: 'product-price',
    icon: 'icofont-money-bag',
    label: 'Product Price',
    url: '/productprice/details',
    collapsed: false,
    subMenu: []
  },
  {
    key: 'product-stock',
    icon: 'iconoir-cart',
    label: 'Product Stock',
    collapsed: false,
    url: '/productstock/details',
    subMenu: []
  },
  {
    key: 'Orders',
    icon: 'iconoir-delivery-truck',
    label: 'Orders',
    collapsed: false,
    url: '/orders/details',
    subMenu: [
      
    ],
  },
  {
    key: 'Customers',
    icon: 'iconoir-hexagon-dice',
    label: 'Customers',
    collapsed: false,
    url: '/customers/details',
    subMenu: [
      
    ],
  },
]
