import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon , SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // ✅ Success
  success(message: string, title: string = 'Success') {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // ✅ Error
  error(message: string, title: string = 'Error') {
    return Swal.fire({
      icon: 'error',
      title,
      text: message
    });
  }

  // ✅ Warning
  warning(message: string, title: string = 'Warning') {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message
    });
  }

  // ✅ Info
  info(message: string, title: string = 'Info') {
    return Swal.fire({
      icon: 'info',
      title,
      text: message
    });
  }

  // ✅ Confirm Dialog (VERY IMPORTANT)
  confirm(message: string, title: string = 'Are you sure?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });
  }

  // ✅ Custom (Flexible)
  custom(options: {
    title?: string;
    text?: string;
    icon?: SweetAlertIcon;
  }) {
    return Swal.fire(options);
  }

  /**
   * Custom Confirm / Login Required Dialog
   * Reusable SweetAlert wrapper with callback
   * @param options.title - Dialog title (default: 'Alert')
   * @param options.message - Dialog message (default: 'Are you sure?')
   * @param options.confirmButtonText - Confirm button text (default: 'Yes')
   * @param options.cancelButtonText - Cancel button text (default: 'Cancel')
   * @param options.callback - Callback function executed if user confirms
   */
  customConfirm(options: {
    title?: string,
    message?: string,
    confirmButtonText?: string,
    cancelButtonText?: string,
    callback?: () => void
  }): void {
    const {
      title = 'Alert',
      message = 'Are you sure?',
      confirmButtonText = 'Yes',
      cancelButtonText = 'Cancel',
      callback
    } = options;

    Swal.fire({
      title,
      text: message,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }
}
