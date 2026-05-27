import { Injectable } from '@angular/core';

/**
 * ErrorLogService is the central exception logger for the client portal.
 * All components and services should route unhandled errors through this service.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

  /**
   * Log an error with contextual metadata.
   * This currently writes to the console and may be extended to remote logging.
   */
  logError(context: string, error: unknown): void {
    const message = this.getErrorMessage(error);
    console.error(`[Error] ${context}:`, message, error);

    // TODO: send this payload to a backend logging endpoint if available
    // this.postLog({ context, message, error });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }
    if (typeof error === 'string') {
      return error;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error';
    }
  }

}
