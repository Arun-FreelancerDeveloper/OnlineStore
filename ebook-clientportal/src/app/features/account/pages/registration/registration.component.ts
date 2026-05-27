/* =====================================================
 * 1. IMPORTS
 * ===================================================== */
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthStorageService } from '../../../../core/services/auth-storage/auth-storage.service';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { CommonModule } from '@angular/common';
import { UserCreationModel } from '../../../../core/models/useraccount/useraccount.model';

/* =====================================================
 * 2. COMPONENT DECORATOR
 * ===================================================== */
/**
 * RegistrationComponent manages user registration.
 * It validates inputs, sends create user requests, and stores login state.
 */
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

/* =====================================================
 * 3. COMPONENT CLASS
 * ===================================================== */
export class RegistrationComponent {

  /* Set Register Model */
  registerData: UserCreationModel = {
    fullname: '',
    email: '',
    password: '',
    userType: 'User',
    vendorNumber: ''
  };

  isLoading = false;

  /* =====================================================
   * 4. DEPENDENCY INJECTION
   * ===================================================== */
  constructor(
    private authStorage: AuthStorageService,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private cartFacade: CartFacadeService
  ) { }

  /* =====================================================
   * 5. REGISTER METHOD
   * ===================================================== */
  register(form: NgForm) {

    if (form.invalid) {
      this.alertService.error('Please complete all required fields.');
      form.control.markAllAsTouched(); // 🔥 highlights fields
      return;
    }

    this.isLoading = true;
    const payload = {
      fullname: this.registerData.fullname,
      email: this.registerData.email,
      password: this.registerData.password,
      userType: 'User',
      vendorNumber: '-'
    };

    this.authService.createUser(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (!res?.data) {
          this.alertService.error(res?.message || 'Registration failed. Please check your details and try again.');
          return;
        }

        const response = res.data;

         // ✅ Extract user properly
        const userData = {
          userid: response.user.userid,
          displayName: response.user.displayName,
          role: response.user.usertype,
          token: response.token
        };

        // ✅ Save user
        this.authStorage.saveUser(userData);

        // 🔥 VERY IMPORTANT (your cart issue fix)
        this.cartFacade.loadCartCount();

        // ✅ Success message
        this.alertService.success(`Welcome ${response.user.displayName}! Your account has been created successfully.`);

        // ✅ Redirect
        this.router.navigate(['/']);

      },

      error: (err: any) => {
        this.isLoading = false;
        this.alertService.error(
          err?.error?.message || 'Oops! Registration failed. Please try again.'
        );
      }
    });
  }
}
