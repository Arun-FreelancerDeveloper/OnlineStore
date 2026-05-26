import { RedirectCommand, Router, Routes, UrlTree } from '@angular/router'
import { LayoutComponent } from './layouts/layout/layout.component'
import { inject } from '@angular/core'
import { AuthenticationService } from './core/service/auth.service'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/analytics',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [
      () => {
        const currentUser = inject(AuthenticationService).session
        const router: Router = inject(Router)
        if (currentUser) return true
        const urlTree: UrlTree = router.parseUrl('/auth/log-in')
        return new RedirectCommand(urlTree, { skipLocationChange: true })
      },
    ],
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEW_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },
]
