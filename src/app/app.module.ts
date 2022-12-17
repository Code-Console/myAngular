import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './UI/menu/menu.component';
import { HomeComponent } from './UI/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Home3DComponent } from './Three/home3-d/home3-d.component';
import { HeaderComponent } from './UI/header/header.component';
import { ContactComponent } from './UI/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    Home3DComponent,
    HeaderComponent,
    ContactComponent
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
