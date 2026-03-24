/* =====================================================
 * 1. IMPORTS
 * ===================================================== */
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";
import { AuthStorageService } from '../../../../core/services/auth-storage/auth-storage.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { CartFacadeService } from '../../../../core/facades/cart-facade.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

/* =====================================================
 * 2. COMPONENT DECORATOR
 * ===================================================== */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

/* =====================================================
 * 3. COMPONENT CLASS
 * ===================================================== */
export class LoginComponent {

  /* Set the Login Model */
  loginData: LoginModel = {
    email: '',
    password: ''
  };
  isLoading = false;


  /* =====================================================
    * 4. DEPENDENCY INJECTION
    * ===================================================== */
  constructor(
    private authStorage: AuthStorageService,
    private router: Router,
    private alertService: AlertService,
    private cartFacade: CartFacadeService,
    private authService: AuthService
  ) { }

  login() {

    if (!this.loginData.email || !this.loginData.password) {
      this.alertService.error('Email and Password required');
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.authService.loginUser(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (!res?.data) {
          this.alertService.error('Invalid login response');
          return;
        }

        const response = res.data;

        // ✅ Extract user properly
        const userData = {
          userid: response.user.id,
          displayName: response.user.displayName,
          role: response.user.role,
          token: response.token
        };

        // ✅ Save user
        this.authStorage.saveUser(userData);

        // 🔥 VERY IMPORTANT (your cart issue fix)
        this.cartFacade.loadCartCount();

        // ✅ Success message
        this.alertService.success('Login successful');

        // ✅ Redirect
        this.router.navigate(['/']);
      },

      error: (err: { error: { message: any; }; }) => {
        this.isLoading = false;
        this.alertService.error(
          err?.error?.message || 'Login failed'
        );
      }
    });
  }
}
