import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discount-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './discount-card.component.html',
})
export class DiscountCardComponent {

  @Input() title: string = 'Page Title';
  @Input() subtitle?: string;

}
