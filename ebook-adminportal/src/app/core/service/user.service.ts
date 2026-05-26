import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.BASE_URL}/user`;

  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<any[]>>(this.apiUrl)
      .pipe(
        map(res =>
          res.data.map(item => ({
            userid: item.userid,
            fullname: item.fullname,
            email: item.email,
            usertype: item.usertype
          }))
        ),
        shareReplay(1)
      );
  }
}
