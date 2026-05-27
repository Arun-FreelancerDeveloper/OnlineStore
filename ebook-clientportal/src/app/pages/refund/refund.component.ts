import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

/**
 * RefundComponent displays the refund policy content for customers.
 * It also includes config-driven company metadata for branding.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.css'
})
export class RefundComponent {
  company: any;
  app : any;
  constructor(private configService: ConfigService) { }
  ngOnInit() {
    this.company = this.configService.company;
  }
  currentYear = new Date().getFullYear();
}
