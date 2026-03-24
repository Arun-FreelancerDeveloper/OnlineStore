import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ SET
  set(key: string, value: any): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ✅ GET
  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // ✅ REMOVE
  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }

  // ✅ CLEAR ALL
  clear(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
  }

  // ✅ EXISTS
  has(key: string): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(key) !== null;
  }
}
