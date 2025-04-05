import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientDetailsComponent } from './pages/client/client-details/client-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    ClientDetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 