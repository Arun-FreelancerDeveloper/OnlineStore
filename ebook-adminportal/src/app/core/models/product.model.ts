export interface Product {
  productid: number;
  productcode: string;
  productname: string;
  shortdescription: string;
  productimage: string;
  categoryid: number;
  categoryname: string;
  groupid?: number;
  groupname?: string;

  subcategoryid: number;
  subcategoryname: string;

  deptid: number;
  deptname: string;

  storeid: number;
  storename: string;

  mrp: number;
  wholesaleprice: number;
  images?: any[];
}
