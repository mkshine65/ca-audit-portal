import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaxFilingListComponent } from './pages/tax-filing/tax-filing-list.component';

import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';
import { TaxFilingService } from './services/tax-filing.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TaxFilingListComponent
  ],
  providers: [
    AuthService,
    ClientService,
    TaxFilingService
  ]
})
export class AppModule { } 