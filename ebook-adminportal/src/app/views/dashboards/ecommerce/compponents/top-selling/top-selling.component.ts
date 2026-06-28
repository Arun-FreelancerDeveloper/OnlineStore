import { CardTitleComponent } from '@/app/components/card-title.component'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { TopSelling } from '../../data'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@/app/common/constants'

@Component({
    selector: 'ecommerce-top-selling',
    imports: [CommonModule, CardTitleComponent, NgbProgressbarModule],
    templateUrl: './top-selling.component.html',
    styles: ``
})
export class TopSellingComponent {
  sellingList = TopSelling
  currency = currency
}
