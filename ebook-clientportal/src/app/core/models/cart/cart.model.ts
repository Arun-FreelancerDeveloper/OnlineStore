export interface CartModel {
  cartid: number;
  productid: number;
  productname: string;
  primaryImage: string;
  mrp: number;
  qty: number;
  marketprice: number;
  dealprice: number;
  saveprice: number;
  convertcurrenyprice : number;
  displayprice: string;
  amount: number;
  displayamountprice: string;
  image: {
    imagepath: string;
    isprimary: boolean;
    productimageid: number;
  }
}
export interface CartUpdateItem {
  cartid: number;
  qty: number;
}
export interface CartUpdateRequest {
  modifiedby: number;
  items: CartUpdateItem[];
}


export interface DiscountRuleModel {
  displayName : string;
  orderCount: number;
  rule: string;
  discount: number;
}
