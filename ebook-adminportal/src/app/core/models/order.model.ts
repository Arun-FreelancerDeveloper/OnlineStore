import { ShippingAddress } from './shipping-address.model';


export interface Order {
  orderid: number;
  orderno: string;
  orderdate: string;
  orderstatus: string;
  totalamount: number;
  paymentstatus: string;
  shippingaddress: ShippingAddress;
  items: OrderItem[];
}

export interface OrderItem {
  orderitemid: number;
  productid: number;
  productname: string;
  productcode: string | null;
  quantity: number;
  unitprice: number;
  totalprice: number;
}
