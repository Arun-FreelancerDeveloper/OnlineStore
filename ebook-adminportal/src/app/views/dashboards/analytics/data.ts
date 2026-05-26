import { ProductType } from "../ecommerce/data"

export type StateType = {
  title: string
  value: string
  icon: string
  description: {
    percentage: string
    text: string
    trend: string
  }
}

export type BrowserType = {
  image: string
  browser: string
  sessions: string
  bounce_rate: string
  transactions: string
}

type SessionType = {
  count?: number
  percentage?: number
  trend?: string
}

export type VisitType = {
  channel: string
  sessions: SessionType
  prev_period: SessionType
  change: SessionType
}

export const stateData: StateType[] = [
  {
    title: 'Today Orders',
    value: '128',
    icon: 'iconoir-cart',
    description: {
      percentage: '+12%',
      text: 'Compared to yesterday',
      trend: 'positive',
    },
  },
  {
    title: 'Today Revenue',
    value: '$48,920',
    icon: 'icofont-money-bag',
    description: {
      percentage: '+9%',
      text: 'Daily growth',
      trend: 'positive',
    },
  },
  {
    title: 'New Customers',
    value: '18',
    icon: 'iconoir-chat-bubble',
    description: {
      percentage: '+20%',
      text: 'First-time buyers today',
      trend: 'positive',
    },
  },
  {
    title: 'Pending Deliveries',
    value: '23',
    icon: 'iconoir-delivery-truck',
    description: {
      percentage: '-4%',
      text: 'Better than yesterday',
      trend: 'positive',
    },
  },
  {
    title: 'Cancelled Orders',
    value: '6',
    icon: 'iconoir-clock',
    description: {
      percentage: '+2%',
      text: 'Slight increase',
      trend: 'negative',
    },
  },
  {
    title: 'Net Profit Today',
    value: '₹18,450',
    icon: 'iconoir-graph-up',
    description: {
      percentage: '+7%',
      text: 'After expenses',
      trend: 'positive',
    },
  },
];

export const BrowserData = [
  {
    image: 'assets/images/logos/chrome.png',
    browser: 'Chrome',
    sessions: '10853 (52%)',
    bounce_rate: '52.80%',
    transactions: '566 (92%)',
  },
  {
    image: 'assets/images/logos/micro-edge.png',
    browser: 'Microsoft Edge',
    sessions: '2545 (47%)',
    bounce_rate: '47.54%',
    transactions: '498 (81%)',
  },
  {
    image: 'assets/images/logos/in-explorer.png',
    browser: 'Internet-Explorer',
    sessions: '1836 (38%)',
    bounce_rate: '41.12%',
    transactions: '455 (74%)',
  },
  {
    image: 'assets/images/logos/opera.png',
    browser: 'Opera',
    sessions: '1958 (31%)',
    bounce_rate: '36.82%',
    transactions: '361 (61%)',
  },
  {
    image: 'assets/images/logos/chrome.png',
    browser: 'Chrome',
    sessions: '10853 (52%)',
    bounce_rate: '52.80%',
    transactions: '566 (92%)',
  },
]

export const VisitsList: VisitType[] = [
  {
    channel: 'Organic search',
    sessions: {
      count: 10853,
      percentage: 52,
    },
    prev_period: {
      count: 566,
      percentage: 92,
    },
    change: {
      percentage: 52.8,
      trend: 'up',
    },
  },
  {
    channel: 'Direct',
    sessions: {
      count: 2545,
      percentage: 47,
    },
    prev_period: {
      count: 498,
      percentage: 81,
    },
    change: {
      percentage: -17.2,
      trend: 'down',
    },
  },
  {
    channel: 'Referal',
    sessions: {
      count: 1836,
      percentage: 38,
    },
    prev_period: {
      count: 455,
      percentage: 74,
    },
    change: {
      percentage: 41.12,
      trend: 'up',
    },
  },
  {
    channel: 'Email',
    sessions: {
      count: 1958,
      percentage: 31,
    },
    prev_period: {
      count: 361,
      percentage: 61,
    },
    change: {
      percentage: -8.24,
      trend: 'down',
    },
  },
  {
    channel: 'Social',
    sessions: {
      count: 1566,
      percentage: 26,
    },
    prev_period: {
      count: 299,
      percentage: 49,
    },
    change: {
      percentage: 29.33,
      trend: 'up',
    },
  },
]

export const ProductList: ProductType[] = [
  {
    productName: 'History Book',
    productImage: 'assets/images/products/01.png',
    productID: 'A3652',
    price: 50,
    originalPrice: 70,
    stockQuantity: 450,
    soldQuantity: 550,
    stockStatus: 'In Stock',
  },
  {
    productName: 'Colorful Pots',
    productImage: 'assets/images/products/02.png',
    productID: 'A5002',
    price: 99,
    originalPrice: 150,
    stockQuantity: 750,
    soldQuantity: 0,
    stockStatus: 'Out of Stock',
  },
  {
    productName: 'Pearl Bracelet',
    productImage: 'assets/images/products/04.png',
    productID: 'A6598',
    price: 199,
    originalPrice: 250,
    stockQuantity: 280,
    soldQuantity: 220,
    stockStatus: 'In Stock',
  },
  {
    productName: 'Dancing Man',
    productImage: 'assets/images/products/06.png',
    productID: 'A9547',
    price: 40,
    originalPrice: 49,
    stockQuantity: 500,
    soldQuantity: 1000,
    stockStatus: 'Out of Stock',
  },
  {
    productName: 'Fire Lamp',
    productImage: 'assets/images/products/05.png',
    productID: 'A2047',
    price: 80,
    originalPrice: 59,
    stockQuantity: 800,
    soldQuantity: 2000,
    stockStatus: 'Out of Stock',
  },
]
