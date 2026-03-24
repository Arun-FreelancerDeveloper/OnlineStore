import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { LoginRequest, UserCreation } from '../../models/useraccount/useraccount.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* =====================================================
   * DEPENDENCIES
   * ===================================================== */
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  /* =====================================================
   * API ENDPOINT
   * ===================================================== */
  private apiUrl!: string;

  constructor() {
    // ✅ Same pattern as FlashSale & Cart
    this.apiUrl = `${this.config.api.baseUrl}`;
  }

  /* =====================================================
   * CREATE USER
   * ===================================================== */
  createUser(payload: UserCreation): Observable<UserCreation> {
    return this.http
      .post<ApiResponse<any>>(this.apiUrl, payload)
      .pipe(
        map(res => res.data)
      );
  }

  /* =====================================================
   * LOGIN USER
   * ===================================================== */
  loginUser(payload: LoginRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/auth`,
      payload
    );
  }
}
