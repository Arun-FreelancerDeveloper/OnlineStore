import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../core/config/config.service';
import { AppConfig } from '../../core/config/config.types';

interface FooterLink {
  label: string;
  route: any[];
}
interface FooterSection {
  title: string;
  links: FooterLink[];
}
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  company: any;
  constructor(private configService: ConfigService) { }
  ngOnInit() {
    this.company = this.configService.company;
  }
  currentYear = new Date().getFullYear();
  readonly footerSections: FooterSection[] = [
    {
      title: 'Information',
      links: [
        { label: 'Sell on Our Platform', route: ['products'] },
        { label: 'Terms & Conditions', route: ['termsconditions'] },
        { label: 'Privacy Policy', route: ['privacy'] },
        { label: 'Returns & Refunds', route: ['refund'] }
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { label: 'Contact Us', route: ['contact'] },
        // { label: 'Store Policies', route: ['policies'] },
        { label: 'Shop Now', route: ['products'] }
      ]
    },
    {
      title: 'My Account',
      links: [
        { label: 'Account Dashboard', route: ['account'] },
        { label: 'Order History', route: ['orderhistory'] },
        { label: 'Cart', route: ['viewcart'] }
      ]
    }
  ];
}
