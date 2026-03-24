import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../../shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

}
