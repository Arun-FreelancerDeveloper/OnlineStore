import { Injectable } from '@angular/core';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { BehaviorSubject } from 'rxjs';
export type UserType = 'Customer' | 'Vendor';
const KEYS = {
  AUTH: 'auth_user',
  GUEST_CART_ID: 'guest_cart_id'
};

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor(private storage: StorageService) { }

  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  // ================= SAVE =================
  saveUser(data: any): void {
    this.storage.set(KEYS.AUTH, data);
    this.userSubject.next(data); // 🔥 notify UI
  }

  // ================= GET =================
  getUser(): any {
    return this.storage.get<any>(KEYS.AUTH);
  }

  // ================= TOKEN =================
  getToken(): string | null {
    const user = this.getUser();
    return user?.token ?? null;
  }

  // ================= LOGIN CHECK =================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= CLEAR =================
  clear(): void {
    this.storage.remove(KEYS.AUTH);
    this.userSubject.next(null); // 🔥 update UI
  }

  // ================= USER TYPE =================
  getCurrentUserType(): UserType {
    return this.getUser()?.usertype ?? 'Customer';
  }

  isVendor(): boolean {
    return this.getCurrentUserType() === 'Vendor';
  }

  isCustomer(): boolean {
    return this.getCurrentUserType() === 'Customer';
  }

  // ================= GUEST CART ID =================
  saveGuestCartId(id: number): void {
    this.storage.set(KEYS.GUEST_CART_ID, id);
  }

  getGuestCartId(): number | null {
    return this.storage.get<number>(KEYS.GUEST_CART_ID);
  }

  ensureGuestCartId(): number {
    let guestCartId = this.getGuestCartId();
    if (!guestCartId) {
      guestCartId = this.generateGuestCartId();
      this.saveGuestCartId(guestCartId);
    }
    return guestCartId;
  }

  clearGuestCartId(): void {
    this.storage.remove(KEYS.GUEST_CART_ID);
  }

  private generateGuestCartId(): number {
    return Math.floor(Math.random() * 900_000_000) + 100_000_000;
  }
}
