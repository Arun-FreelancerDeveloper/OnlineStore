import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorLogService } from './error-log.service';

/**
 * GlobalErrorHandler captures uncaught Angular errors and routes them to ErrorLogService.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorLogService: ErrorLogService) {}

  handleError(error: unknown): void {
    this.errorLogService.logError('GlobalErrorHandler', error);
    // Preserve Angular's default behavior after logging.
    throw error;
  }
}
