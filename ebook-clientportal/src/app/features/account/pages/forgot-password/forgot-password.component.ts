
/* =====================================================
 * 1. IMPORTS
 * ===================================================== */
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRequest, UserCreationModel } from '../../../../core/models/useraccount/useraccount.model';

/* =====================================================
 * 2. COMPONENT DECORATOR
 * ===================================================== */
/**
 * ForgotPasswordComponent handles password reset requests.
 * It sends the reset email callback URL to the authentication API.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

/* =====================================================
 * 3. COMPONENT CLASS
 * ===================================================== */
export class ForgotPasswordComponent {

  /* Set Forgot Password Model */
  forgotPasswordData: ForgotPasswordRequest = {
    email: '',
    callbackurl: window.location.origin + '\resetpassword'
  };

  isLoading = false;

  /* =====================================================
   * 4. DEPENDENCY INJECTION
   * ===================================================== */
  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private cartFacade: CartFacadeService
  ) { }

  /* =====================================================
   * 5. Send Mail
   * ===================================================== */
  sendRequest(form: NgForm) {

    if (form.invalid) {
      this.alertService.error('Please enter your email.');
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.forgotPasswordData.email,
      callbackurl: window.location.origin + '/resetpassword'  // ✅ fix slash
    };

    this.authService.forgotPassword(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (!res?.success) {
          this.alertService.error(res?.message || 'Request failed');
          return;
        }

        // ✅ SUCCESS (No login here)
        this.alertService.success(
          'Password reset link has been sent to your email.'
        );

        // ✅ Optional redirect
        this.router.navigate(['/signin']);
      },

      error: (err: any) => {
        this.isLoading = false;
        this.alertService.error(
          err?.error?.message || 'Something went wrong'
        );
      }
    });
  }
}
