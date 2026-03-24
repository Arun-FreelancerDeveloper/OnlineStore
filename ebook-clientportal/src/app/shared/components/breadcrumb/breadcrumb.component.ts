import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BreadcrumbItem {
  label: string;
  link?: string;
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {

  @Input() title: string = 'Page Title';
  @Input() subtitle?: string;
  // ✅ New dynamic breadcrumb
  @Input() items: BreadcrumbItem[] = [];
}
