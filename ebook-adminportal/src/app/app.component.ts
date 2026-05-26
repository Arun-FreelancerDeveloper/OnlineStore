import { Component, inject, ViewChild } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouterOutlet,
  Router,
  type Event,
} from '@angular/router'
import { TitleService } from './core/service/title.service'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  startedClass = false
  private titleService = inject(TitleService)
  private router = inject(Router)

  constructor() {
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })
  }

  ngOnInit(): void {
    this.titleService.init()
  }

  // show Loader when route change
  checkRouteChange(routerEvent: Event) {
   
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ){}
  }
}
