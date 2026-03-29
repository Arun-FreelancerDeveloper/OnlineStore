import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { CartModel, DiscountRuleModel } from '../../../core/models/cart/cart.model';
import { ShippingAddress } from '../../../core/models/shipping/shipping.model';
import { AuthStorageService } from '../../../core/services/auth-storage/auth-storage.service';
import { CartFacadeService } from '../../../core/facades/cart-facade.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { ShoppingCardComponent } from "../../../shared/components/shopping-card/shopping-card.component";
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { ShippingService } from '../../../core/services/shipping/shipping.service';
import { LocationService } from '../../../shared/services/location/location.service';
import { OrderService } from '../../../core/services/order/order.service';
import { PlaceOrderPayload } from '../../../core/models/order/order.model';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  standalone: true,
  providers: [CurrencyPipe],
  imports: [CommonModule, FormsModule, ShoppingCardComponent, BreadcrumbComponent ,RouterLink ]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  countries: any[] = [];
  filteredCountries: any[] = [];

  states: any[] = [];
  filteredStates: any[] = [];

  cities: any[] = [];
  filteredCities: string[] = [];

  cartItems: CartModel[] = [];
  currentCurrency: string = '';
  currentUserDiscountRule: DiscountRuleModel = {
    displayName: '',
    orderCount: 0,
    rule: '',
    discount: 0
  };

  shippingModel: ShippingAddress = {
    addressid: 0,
    userid: 0,
    fullname: '',
    phone: '',
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    postalcode: '',
    country: '',
    isdefault: true,
    deliverynote: '',
    currency: this.currentCurrency
  };


  isLoading = true;
  selectedPayment: string = 'Cash on delivery';
  paymentMethods = [
    {
      label: 'Cash on delivery',
      description: 'Pay with cash upon delivery.'
    },
    {
      label: 'Online payment',
      description: 'Please send your check payment using upi.'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private cartFacade: CartFacadeService,
    private currencyService: CurrencyService,
    private authStorage: AuthStorageService,
    private currencyPipe: CurrencyPipe,
    private alertService: AlertService,
    private shippingService: ShippingService,
    private locationService: LocationService,
    private orderService: OrderService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.loadShippingAddress(); // ✅ NEW
    this.loadCountries();
    this.loadCart();
    this.loadDiscountRule();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCart(): void {
    const cart$ = this.cartFacade.getCartItems();
    if (!cart$) { this.isLoading = false; return; }

    combineLatest([cart$, this.currencyService.currency$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([res, currency]) => {
        this.isLoading = false;
        this.currentCurrency = currency;
        console.log('Cart Items from backend:', res?.data); // Check if backend returns data
        this.cartItems = (res?.data ?? []).map(item => ({
          ...item,
          convertcurrenyprice: this.currencyService.convertPrice(item.dealprice, currency),
          displayamountprice: this.currencyPipe.transform(item.dealprice * item.qty, currency, 'symbol', '1.2-2') || '',
          displayprice: this.currencyPipe.transform(item.dealprice, currency, 'symbol', '1.2-2') || ''
        }));
      });
  }

  private loadDiscountRule(): void {
    this.cartFacade.getDiscountRule()?.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.success) {
        this.currentUserDiscountRule = {
          displayName: res.data.displayName || '',
          orderCount: res.data.orderCount,
          rule: res.data.rule,
          discount: res.data.discount
        };
      }
    });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.qty * item.convertcurrenyprice, 0);
  }

  getDiscountAmount(): number {
    return (this.getCartTotal() * (this.currentUserDiscountRule.discount || 0)) / 100;
  }

  getPayAmount(): number {
    return this.getCartTotal() - this.getDiscountAmount();
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, this.currentCurrency, 'symbol', '1.2-2') || '';
  }

  placeOrder(form: any): void {

    var isContinue = true;
    if (form.invalid) {
      form.control.markAllAsTouched(); // show all errors
      return;
    }

    this.isLoading = true;
    const user = this.authStorage.getUser();
    if (!user) {
      this.alertService.error('Please login to place order');
      return;
    }

    /* Step - 1 Automatically Latest Shipping Address Store  */
    const shippingpayload: ShippingAddress = {
      addressid: this.shippingModel.addressid,
      userid: user.userid,
      fullname: this.shippingModel.fullname,
      phone: this.shippingModel.phone,
      addressline1: this.shippingModel.addressline1,
      addressline2: this.shippingModel.addressline2,
      city: this.shippingModel.city,
      state: this.shippingModel.state,
      postalcode: this.shippingModel.postalcode,
      country: this.shippingModel.country,
      isdefault: true,
      deliverynote: this.shippingModel.deliverynote,
      currency: this.currentCurrency
    };
    this.shippingService.createShippingAddress(shippingpayload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            /* Set the Lastest Shipping Id */
            this.shippingModel.addressid = res.data.addressId;
            isContinue = true;
          }
          else {
            this.alertService.error(
              res.message || "We couldn’t save your address. Please check your details and try again."
            );
            isContinue = false;
          }
        },
        error: (err) => {
          this.alertService.error(
            // "Unable to save your address right now. Please check your internet connection or try again later."
            err
          );
          isContinue = false;
        }
      });


    /* Step - 2 Place the Order */
    if (isContinue) {

      // ✅ Final payload
      const payload: PlaceOrderPayload = {
        userid: user.userid,
        shippingaddressid: this.shippingModel.addressid,
        totalamount: this.getPayAmount() + this.getDiscountAmount(),
        discountamount: this.getDiscountAmount(),
        payamount: this.getPayAmount() - this.getDiscountAmount(),
        currency: this.currentCurrency,
        paymentstatus: this.selectedPayment,
        createdby: user.userid,
        items: this.cartItems.map(x => ({
          productid: x.productid,
          productname: x.productname,
          productcode: "-",
          quantity: x.qty,
          unitprice: x.convertcurrenyprice

        }))
      };

      this.orderService.placeOrder(payload).subscribe({
        next: (res) => {
          if (res.success) {
            // ✅ optional actions
            this.alertService.success('Order Placed successfully');
            this.cartFacade.clearCartCache();
            //this.rout(['/']);
          } else {
            this.alertService.error(
              res.message, 'Order failed:'
            );
          }
        },
        error: (err) => {
          this.alertService.error(
            "Unable to placing your order right now. Please check your internet connection or try again later."
          );
        }
      });
    }
  }

  private loadShippingAddress(): void {
    const user = this.authStorage.getUser();
    if (!user) return;
    this.shippingService.getShippingByUserId(user.userid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data?.length) {
            this.shippingModel =
              res.data.find(x => x.isdefault) || res.data[0];
          }
        },
        error: () => {
          console.warn('No shipping address found');
        }
      });
  }


  // ================= LOCATION =================


  /* ================= Country ================= */
  loadCountries() {
    this.locationService.getCountries().subscribe(res => {
      this.countries = (res.data || []).map((c: any) => ({
        name: c.name
      }));
    });
  }
  onCountryChange(selectedState?: string) {
    this.states = [];
    this.cities = [];

    // store old value (for edit / auto-fill)
    const prevState = selectedState || this.shippingModel.state;

    this.shippingModel.state = '';
    this.shippingModel.city = '';

    if (!this.shippingModel.country) return;

    this.locationService.getStates(this.shippingModel.country)
      .subscribe(res => {
        this.states = res?.data?.states || [];

        // ✅ Assign state if exists in dropdown
        if (prevState) {
          const match = this.states.find(s => s.name === prevState);
          if (match) {
            this.shippingModel.state = match.name;

            // 🔥 Load cities automatically
            this.onStateChange(this.shippingModel.state);
          } else {
            // fallback (for countries like Dominica)
            this.shippingModel.state = prevState;
          }
        }
      });
  }
  filterCountries() {
    const value = this.shippingModel.country?.toLowerCase() || '';
    this.filteredCountries = this.countries.filter(c =>
      c.name.toLowerCase().includes(value)
    );
  }
  selectCountry(country: any) {
    this.shippingModel.country = country.name;
    this.filteredCountries = [];
    // 🔥 Important: trigger state load
    this.onCountryChange();
  }

  /* ================= State ================= */
  onStateChange(selectedCity?: string) {
    this.cities = [];

    const prevCity = selectedCity || this.shippingModel.city;

    this.shippingModel.city = '';

    if (!this.shippingModel.state) return;

    this.locationService.getCities(
      this.shippingModel.country,
      this.shippingModel.state
    ).subscribe(res => {
      this.cities = res?.data || [];

      // ✅ Assign city
      if (prevCity) {
        const match = this.cities.find(c => c === prevCity);
        if (match) {
          this.shippingModel.city = match;
        } else {
          this.shippingModel.city = prevCity; // fallback
        }
      }
    });
  }
  filterStates() {
    const value = this.shippingModel.state?.toLowerCase() || '';
    this.filteredStates = this.states.filter(s =>
      s.name.toLowerCase().includes(value)
    );
  }
  selectState(state: any) {
    this.shippingModel.state = state.name;
    this.filteredStates = [];

    // 🔥 trigger city load
    this.onStateChange();
  }




  // 🇮🇳 PIN Auto-fill (India only)
  onPincodeChange(pincode: string) {
    if (this.shippingModel.country !== 'India') return;

    if (pincode.length === 6) {
      this.locationService.getAddressFromPincode(pincode)
        .subscribe((res: any) => {
          if (res[0].Status === 'Success') {
            const data = res[0].PostOffice[0];

            this.shippingModel.city = data.District;
            this.shippingModel.state = data.State;

            this.onCountryChange();

            setTimeout(() => {
              this.shippingModel.state = data.State;
              this.onStateChange();

              setTimeout(() => {
                this.shippingModel.city = data.District;
              }, 200);
            }, 200);
          }
        });
    }
  }



  filterCities() {
    const value = this.shippingModel.city?.toLowerCase() || '';
    this.filteredCities = this.cities.filter(city =>
      city.toLowerCase().includes(value)
    );
  }
  selectCity(city: string) {
    this.shippingModel.city = city;
    this.filteredCities = [];
  }


  // 📍 Current Location
  useCurrentLocation() {
    this.locationService.getFullAddressFromLocation()
      .subscribe({
        next: (res: any) => {
          console.log('Location Response:', res);
          const addr = res.address;
          this.shippingModel.country = addr.country || '';
          this.shippingModel.state = addr.state || '';
          this.shippingModel.city = addr.city || addr.town || addr.village || '';
          this.shippingModel.postalcode = addr.postcode || '';
          this.onCountryChange();

          setTimeout(() => {
            this.onStateChange();
          }, 1000);
        },
        error: (err) => {
          console.error('Location Error:', err);
          alert('Unable to fetch location. Please allow location access.');
        }
      });
  }

}
