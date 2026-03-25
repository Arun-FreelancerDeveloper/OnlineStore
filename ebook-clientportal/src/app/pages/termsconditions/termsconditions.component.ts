
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

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
