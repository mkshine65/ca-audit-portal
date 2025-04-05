import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { Client, ClientResponse } from '../../models/client.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
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
  pageSizeOptions = [10, 20, 50];

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = null;

    this.clientService.getClients(this.currentPage, this.pageSize).subscribe({
      next: (response: ClientResponse) => {
        this.clients = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.error = 'Failed to load clients. Please try again.';
        this.loading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
  }

  navigateToPayment(): void {
    if (this.selectedClient) {
      this.router.navigate(['/payment', this.selectedClient.id]);
    }
  }

  navigateToTaxFiling(): void {
    if (this.selectedClient) {
      this.router.navigate(['/tax-filing', this.selectedClient.id]);
    }
  }

  navigateToDocuments(): void {
    if (this.selectedClient) {
      this.router.navigate(['/documents', this.selectedClient.id]);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page when changing page size
    this.loadClients();
  }

  viewClientDetails(clientId: number): void {
    this.router.navigate(['/client', clientId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: unknown) => {
        console.error('Error during logout:', error);
        // Still navigate to login even if the logout API call fails
        this.router.navigate(['/login']);
      }
    });
  }
} 