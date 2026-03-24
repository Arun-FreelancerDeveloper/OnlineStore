import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BannerItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner.component.html',
})
export class BannerComponent {

  /* ================= INPUTS ================= */

  // Title (supports HTML)
  @Input() title: string = 'Page Title';

  // Subtitle text
  @Input() subtitle?: string;

  // Breadcrumb items
  @Input() items: BannerItem[] = [];

  // Banner image (NEW 🔥)
  @Input() image: string = 'assets/images/icon/slider-4.png';

}
