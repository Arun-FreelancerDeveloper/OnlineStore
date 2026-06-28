import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { BrowserData } from '../../data'

@Component({
    selector: 'analytics-browser',
    imports: [CommonModule],
    templateUrl: './browser.component.html',
    styles: ``
})
export class BrowserComponent {
  BrowserData = BrowserData
}
