export interface RecommendedProductModel {
  productid: number;
  productname: string;
  productcode: string;
  productimage: string;
  ishasclude: boolean;
  cludeimage: string;
  shortdescription: string;
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

  // ⚠️ API returns string → convert to number in service
  mrp: number;
  wholesaleprice: number;

  total_sold: number;
  total_stock: number;

  total_soldpercentage: number;
  discount_percentage: number;

  recommendation_score: number;

  // ✅ Extra UI fields (optional)
  displayprice?: number;

  images: any[];
}
