import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VerticalComponent } from './layouts/vertical/vertical.component';

import { LoadingBarModule } from '@ngx-loading-bar/core';

@NgModule({
  declarations: [
    AppComponent,
    VerticalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoadingBarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
