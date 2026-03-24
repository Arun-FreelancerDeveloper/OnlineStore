import { Injectable } from '@angular/core';
import { AppConfig } from './config.types';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: AppConfig;

  async load(): Promise<void> {
    const response = await fetch('/assets/app-config/config.json');
    const json = await response.json();

    this.config = json;
    console.log('✅ Config Loaded:', this.config);
  }

  get(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded!');
    }
    return this.config;
  }

  // 🔥 Shortcuts (Best Practice)
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
}
