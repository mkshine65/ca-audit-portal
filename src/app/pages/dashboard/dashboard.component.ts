import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clients: Client[] = [];
  selectedClient: Client | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = null;

    this.clientService.getClients(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.clients = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load clients. Please try again.';
        this.loading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    console.log('Selected client:', client);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadClients();
  }

  onPaymentClick(): void {
    const clientId = this.selectedClient?.id || this.clients[0]?.id;
    if (clientId) {
      this.router.navigate(['/payments', clientId]);
    }
  }

  onTaxFilingClick(): void {
    this.router.navigate(['/tax-filings']);
  }

  onDocumentsClick(): void {
    const clientId = this.selectedClient?.id || this.clients[0]?.id;
    if (clientId) {
      this.router.navigate(['/documents', clientId]);
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
} 