import { CardTitleComponent } from '@/app/components/card-title.component'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { OrderList } from '../../data'
import { currency } from '@/app/common/constants'

@Component({
    selector: 'ecommerce-recent-order',
    imports: [CommonModule, CardTitleComponent],
    templateUrl: './recent-order.component.html',
    styles: ``
})
export class RecentOrderComponent {
  orderList = OrderList
  currency = currency
}
