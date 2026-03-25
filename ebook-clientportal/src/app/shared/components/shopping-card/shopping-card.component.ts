import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-card.component.html',
})
export class ShoppingCardComponent {

  @Input() title: string = 'Page Title';
  @Input() subtitle?: string;

}
