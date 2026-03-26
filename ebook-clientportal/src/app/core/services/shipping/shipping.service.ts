import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/api-response/api-response.model';
import { ShippingAddress } from '../../models/shipping/shipping.model';
import { ConfigService } from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  // ===== DEPENDENCIES =====
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  // ===== API =====
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = `${this.config.api.baseUrl}/shipping`;
  }

  /* =====================================================
   * CREATE SHIPPING ADDRESS
   * ===================================================== */
  createShippingAddress(
    payload: ShippingAddress
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, payload);
  }

  /* =====================================================
   * GET SHIPPING ADDRESSES BY USER ID
   * ===================================================== */
  getShippingByUserId(
    userId: number
  ): Observable<ApiResponse<ShippingAddress[]>> {
    return this.http.get<ApiResponse<ShippingAddress[]>>(
      `${this.apiUrl}/${userId}`
    );
  }
}
