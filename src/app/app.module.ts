import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from 'modules';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
