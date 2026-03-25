import {
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/services/alert/alert.service';
import { AuthStorageService } from '../../core/services/auth-storage/auth-storage.service';
import { CartService } from '../../features/cart/services/cart.service';
import { ConfigService } from '../../core/config/config.service';
import { Observable } from 'rxjs';
import { CartFacadeService } from '../../core/facades/cart-facade.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  // ===== PLATFORM =====
  isBrowser = false;
  windowWidth = 0;

  // ===== CONFIG DATA =====
  company: any;
  mail = '';

  // ===== UI STATE =====
  isMobileMenuActive = false;
  activeIndex: string | null = null;
  categoryDropdownVisible = false;

  // ===== DATA =====
  searchTerm = '';
  selectedCategory = '';
  userName = '';


  // ===== OBSERVABLE =====
  user$ = this.authStorage.user$;
  cartCount$ = this.cartFacade.cartCount$
  cdr: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private alert: AlertService,
    private authStorage: AuthStorageService,
    private cartService: CartService,
    private configService: ConfigService,
    private cartFacade: CartFacadeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
    }
  }

  // ================= INIT =================
  ngOnInit(): void {
    // ✅ LOAD CONFIG PROPERLY
    const config = this.configService.get();

    this.company = config.company;
    this.mail = config.company.support.email;

    // 🔥 Load on start
    this.cartFacade.loadCartCount();

    // 🔥 Force UI update after data change
    this.cartCount$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  // ================= AUTH =================
  isLoggedIn(): boolean {
    return this.authStorage.isLoggedIn();
  }

  logout(): void {
    this.alert.confirm('You will be logged out!')
      .then(res => {
        if (res.isConfirmed) {
          this.authStorage.clear();
          this.cartFacade.clearCartCache();
          this.cartFacade.loadCartCount();
          this.router.navigate(['/signin']);
          this.alert.success('Logged out successfully');
        }
      });
  }

  // ================= SEARCH =================
  onSearch() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchTerm }
    });
  }

  // ================= MOBILE =================
  openMobileMenu() {
    this.isMobileMenuActive = true;
    document.body.classList.add('scroll-hide-sm');
  }

  closeMobileMenu() {
    this.isMobileMenuActive = false;
    document.body.classList.remove('scroll-hide-sm');
  }

  toggleSubmenu(index: string) {
    if (this.windowWidth < 992) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }

  // ================= CATEGORY =================
  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-dropdown-wrapper')) {
      this.categoryDropdownVisible = false;
    }
  }

  // ================= WINDOW =================
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  // ================= ROUTE =================
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
  isParentActive(routes: string[]): boolean {
    return routes.some(r => this.router.url.startsWith(r));
  }
}
