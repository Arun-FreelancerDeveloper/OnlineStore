import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';
import { ShoppingCardComponent } from "../../shared/components/shopping-card/shopping-card.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent, ShoppingCardComponent],
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
