import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // ===== CONFIG VALUES =====
  private baseCurrency!: string;
  private exchangeApi!: string;
  private detectCurrencyApi!: string;
  private countryCurrencyMap: Record<string, string> = {};

  // ===== STATE =====
  private currencySubject = new BehaviorSubject<string>('XCD');
  currency$ = this.currencySubject.asObservable();

  private exchangeRates: Record<string, number> = {};

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.initialize(); // ✅ safe (config already loaded via APP_INITIALIZER)
  }

  // =====================================================
  // INITIALIZE FROM CONFIG
  // =====================================================
  private initialize() {

    const currencyConfig = this.config.currency;

    this.baseCurrency = currencyConfig.base;
    this.exchangeApi = currencyConfig.apis.exchange;
    this.detectCurrencyApi = currencyConfig.apis.geo;
    this.countryCurrencyMap = currencyConfig.countryMap;

    // ✅ set default
    this.currencySubject.next(currencyConfig.default);

    // 🔥 load data
    if (currencyConfig.autoDetect) {
      this.detectCurrency();
    }

    this.loadRates();
  }

  // =====================================================
  // 🌍 DETECT USER LOCATION
  // =====================================================
  private detectCurrency() {
    this.http.get<any>(this.detectCurrencyApi).subscribe({
      next: (res) => {
        const currency =
          this.countryCurrencyMap[res.country] ||
          this.currencySubject.value;

        this.currencySubject.next(currency);
      },
      error: () => {
        console.warn('Currency detection failed');
      }
    });
  }

  // =====================================================
  // 💱 LOAD EXCHANGE RATES
  // =====================================================
  private loadRates() {
    this.http.get<any>(`${this.exchangeApi}${this.baseCurrency}`)
      .subscribe({
        next: (res) => {
          this.exchangeRates = res.rates;
        },
        error: () => {
          console.warn('Using fallback exchange rates');
          this.exchangeRates = {
            XCD: 1,
            USD: 0.37,
            EUR: 0.34,
            INR: 83
          };
        }
      });
  }

  // =====================================================
  // 🔁 CONVERT PRICE
  // =====================================================
  convertPrice(amount: number, toCurrency: string): number {
    if (toCurrency === this.baseCurrency) return amount;

    const rate = this.exchangeRates[toCurrency];
    return rate ? amount * rate : amount;
  }

  // =====================================================
  // 🔧 MANUAL OVERRIDE
  // =====================================================
  setCurrency(currency: string) {
    this.currencySubject.next(currency);
  }
}
