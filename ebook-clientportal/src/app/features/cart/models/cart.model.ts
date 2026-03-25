export interface CartItem {
  cartid: number;
  productid: number;
  productname: string;
  primaryImage: string;
  displayprice: number;
  mrp: number;
  wholesaleprice: number;
  qty: number;
  amount: number,
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
