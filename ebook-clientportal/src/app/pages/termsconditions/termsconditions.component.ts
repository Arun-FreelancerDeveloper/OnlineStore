
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

/**
 * TermsconditionsComponent renders the application's terms and conditions.
 * It uses configured company metadata for legal and branding footers.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './termsconditions.component.html',
  styleUrl: './termsconditions.component.css'
})
export class TermsconditionsComponent {
  company: any;
  app : any;
  constructor(private configService: ConfigService) { }
  ngOnInit() {
    this.company = this.configService.company;
  }
  currentYear = new Date().getFullYear();
}
