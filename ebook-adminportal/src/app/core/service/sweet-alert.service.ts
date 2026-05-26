import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {

  // 🔹 Default auto-close duration (ms)
  private autoCloseTime = 2000;

  success(message: string, title = 'Done'): void {
    this.fire('success', title, message, true);
  }

  info(message: string, title = 'Info'): void {
    this.fire('info', title, message, true);
  }

  warning(message: string, title = 'Heads up'): void {
    this.fire('warning', title, message);
  }

  error(message: string, title = 'Oops'): void {
    this.fire('error', title, message);
  }

  async confirm(
    message: string,
    title = 'Please confirm'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false
    });

    return result.isConfirmed;
  }

  showLoader(message = 'Please wait...'): void {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  hideLoader(): void {
    Swal.close();
  }

  private fire(
    icon: SweetAlertIcon,
    title: string,
    text: string,
    autoClose = false
  ): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: autoClose ? undefined : 'OK',
      timer: autoClose ? this.autoCloseTime : undefined,
      timerProgressBar: autoClose,
      showConfirmButton: !autoClose,
    });
  }
}
