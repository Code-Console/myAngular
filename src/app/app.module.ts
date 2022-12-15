import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './UI/menu/menu.component';
import { HomeComponent } from './UI/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Home3DComponent } from './Three/home3-d/home3-d.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    Home3DComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
