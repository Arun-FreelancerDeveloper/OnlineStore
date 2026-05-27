import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";

/**
 * AboutusComponent renders the About Us page.
 * It shows company information and brand positioning details.
 */
@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {

}
