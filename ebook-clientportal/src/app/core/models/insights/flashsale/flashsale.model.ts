export interface FlashSaleProductModel {
  productid: number;
  productcode: string;
  productname: string;
  shortdescription: string;
  productimage: string;
  ishasclude : boolean,
  cludeimage: string;

  groupid: number;
  groupname: string;
  categoryid: number;
  categoryname: string;

  subcategoryid: number;
  subcategoryname: string;

  deptid: number;
  deptname: string;

  storeid: number;
  storename: string;

  displayprice :  number;
  mrp: number;
  wholesaleprice: number;

  total_sold ?: number; // Optional, if your API provides this
  total_stock ?: number; // Optional, if your API provides this
  total_soldpercentage ?: number; // Optional, if your API provides this
  total_stars ?: number; // Optional, if your API provides this

  images: any[];
}
