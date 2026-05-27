import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ConfigService } from '../app/core/config/config.service';
import { GlobalErrorHandler } from '../app/shared/services/error/global-error-handler';
import { routes } from './app.routes';

/**
 * Application initializer that loads remote configuration before the app starts.
 * This is a central entry point for environment-specific settings and feature flags.
 */
export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

/**
 * Root application configuration for standalone bootstrap.
 * - Router is provided here.
 * - HTTP client is available globally.
 * - APP_INITIALIZER ensures config is loaded before components run.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),

    // Global error handler for uncaught application exceptions.
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

    // 🔥 IMPORTANT PART
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ]
};
