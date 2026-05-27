import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './config.types';

/**
 * ConfigService loads and stores runtime configuration values for the app.
 * It is initialized during app bootstrap via APP_INITIALIZER and exposes
 * typed shortcuts for API, company, currency, insights, location, and tax settings.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: AppConfig;

  // Use Angular HttpClient (injectable) for easier testing and DI
  private readonly http = inject(HttpClient);

  /**
   * Load runtime configuration from assets.
   * Uses HttpClient so it can be mocked in unit tests via HttpTestingController.
   */
  async load(): Promise<void> {
    const json = await firstValueFrom(this.http.get<AppConfig>('/assets/app-config/config.json'));
    this.config = json;
  }

  get(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded!');
    }
    return this.config;
  }

  // Shortcuts (Best Practice)
  get api() {
    return this.get().api;
  }

  get company() {
    return this.get().company;
  }

  get currency() {
    return this.get().currency;
  }

  get insights() {
    return this.get().insights;
  }

  get location() {
    return this.get().location;
  }

  get TaxSettings(){
    return this.get().TaxSettings;
  }

}
