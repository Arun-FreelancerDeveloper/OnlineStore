import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { User } from '@/app/core/models/user.model'
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { UserService} from '@/app/core/service/user.service'

@Component({
    selector: 'app-customerdetails',
    standalone : true,
    imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './customerdetails.component.html',
    styles: ``
})
export class CustomerDetailsComponent {

 private userService = inject(UserService);

  lstCustomers: any[] = [];
  loading = false;
  selectedUserType: string = 'All';
filteredCustomers: any[] = [];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        this.lstCustomers = res.map((u, index) => ({
          id: u.userid,
          sno: index + 1,
          customername: u.fullname,
          email: u.email,
          phone: '-',          // not coming from API
          address: '-',        // not coming from API
          Usertype: u.usertype
        }));
        this.filteredCustomers = [...this.lstCustomers];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterByUserType(type: string): void {
  this.selectedUserType = type;

  if (type === 'All') {
    this.filteredCustomers = [...this.lstCustomers];
  } else {
    this.filteredCustomers = this.lstCustomers.filter(
      c => c.Usertype === type
    );
  }
}

}
