import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  company: any;
  constructor(private configService: ConfigService) { }
  ngOnInit() {
    this.company = this.configService.company;
  }
  currentYear = new Date().getFullYear();

  
}
