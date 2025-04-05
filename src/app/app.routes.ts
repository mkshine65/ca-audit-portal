import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ClientDetailsComponent } from './pages/client-details/client-details.component';
import { TaxFilingListComponent } from './pages/tax-filing/tax-filing-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tax-filings', component: TaxFilingListComponent, canActivate: [AuthGuard] },
  { path: 'tax-filings/:id', component: TaxFilingListComponent, canActivate: [AuthGuard] },
  {
    path: 'client-details/:id',
    component: ClientDetailsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'tax-filings',
        pathMatch: 'full'
      },
      {
        path: 'tax-filings',
        component: TaxFilingListComponent
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payment/payment-list.component').then(m => m.PaymentListComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./pages/document/document-list.component').then(m => m.DocumentListComponent)
      }
    ]
  }
];
