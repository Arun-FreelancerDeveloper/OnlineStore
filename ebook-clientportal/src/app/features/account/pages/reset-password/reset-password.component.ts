/* =====================================================
 * 1. IMPORTS
 * ===================================================== */
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../../../../core/models/useraccount/useraccount.model';

/* =====================================================
 * 2. COMPONENT DECORATOR
 * ===================================================== */
/**
 * ResetPasswordComponent allows users to create a new password using a token.
 * It validates password match and sends the change request to the auth service.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

/* =====================================================
 * 3. COMPONENT CLASS
 * ===================================================== */
export class ResetPasswordComponent {

  /* Set Forgot Password Model */
  resetPasswordData: ResetPasswordRequest = {
    token: '',
    newpassword: '',
    confirmPassword: ''
  };

  isLoading = false;

  /* =====================================================
   * 4. DEPENDENCY INJECTION
   * ===================================================== */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private cartFacade: CartFacadeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.resetPasswordData.token = params.get('token') || '';
    });
  }

  /* =====================================================
   * 5. Send Mail
   * ===================================================== */
  sendRequest(form: NgForm) {

    if (form.invalid) {
      this.alertService.error('Please enter password.');
      form.control.markAllAsTouched();
      return;
    }
    else if (this.resetPasswordData.newpassword != this.resetPasswordData.confirmPassword) {
      this.alertService.error('Confirm password is not match.');
      return;
    }

    debugger;
    this.isLoading = true;
    const payload = {
      token: this.resetPasswordData.token,
      newpassword: this.resetPasswordData.newpassword,
      confirmPassword: this.resetPasswordData.confirmPassword,
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (!res?.success) {
          this.alertService.error(res?.message || 'Request failed');
          return;
        }

        // ✅ SUCCESS (No login here)
        this.alertService.success(
          'Password has been changed successfully.'
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
