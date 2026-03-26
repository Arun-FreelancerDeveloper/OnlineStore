import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from '../../../core/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly config = inject(ConfigService);
  private readonly http = inject(HttpClient);

  // ✅ 1. Get City/State from PIN Code (India)
  getAddressFromPincode(pincode: string): Observable<any> {
    return this.http.get(this.config.location.pincodeApi + `/${pincode}`);
  }

  // ✅ 2. Get Current Coordinates (Browser GPS)
  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((observer: Observer<GeolocationPosition>) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation not supported');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      }
    });
  }

  // ✅ 3. Reverse Geocoding (Lat/Lng → Address)
  reverseGeocode(lat: number, lng: number): Observable<any> {
    const url = this.config.location.liveLocationApi + `?format=json&lat=${lat}&lon=${lng}`;
    return this.http.get(url);
  }

  // ✅ 4. Combined Method (Full Auto Address)
  getFullAddressFromLocation(): Observable<any> {
    return new Observable((observer) => {
      this.getCurrentPosition().subscribe({
        next: (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          this.reverseGeocode(lat, lng).subscribe({
            next: (res: any) => {
              observer.next(res);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getCountries() {
    return this.http.get<any>('https://countriesnow.space/api/v0.1/countries/positions');
  }

  getStates(country: string) {
    return this.http.post<any>(
      'https://countriesnow.space/api/v0.1/countries/states',
      { country }
    );
  }

  getCities(country: string, state: string) {
    return this.http.post<any>(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      { country, state }
    );
  }
}
