import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './newsletter-card.component.html',
})
export class NewsletterCardComponent {

  @Input() title: string = 'Page Title';
  @Input() subtitle?: string;

}
