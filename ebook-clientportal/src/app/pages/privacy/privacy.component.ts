import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  company: any;
  app : any;
  constructor(private configService: ConfigService) { }
  ngOnInit() {
    this.company = this.configService.company;
  }
  currentYear = new Date().getFullYear();
}
