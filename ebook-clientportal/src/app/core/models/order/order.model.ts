export interface OrderItem {
  productid: number;
  productname: string;
  productcode: string;
  quantity: number;
  unitprice: number;
  taxpercentage: number;
  taxamount: number;
  totalpayamount: number;
}

export interface PlaceOrderPayload {
  userid: number;
  shippingaddressid: number;
  totalamount: number;
  totaltaxamount : number;
  discountamount: number;
  payamount: number;
  currency: string;
  paymentstatus: string;
  createdby: number;
  items: OrderItem[];
}
