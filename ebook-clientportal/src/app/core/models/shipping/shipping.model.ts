export interface ShippingAddress {
  addressid : number;
  userid: number;
  fullname: string;
  phone: string;
  addressline1: string;
  addressline2?: string;
  city: string;
  state: string;
  postalcode: string;
  country: string;
  isdefault: boolean;
  deliverynote : string;
  currency : string;
}
