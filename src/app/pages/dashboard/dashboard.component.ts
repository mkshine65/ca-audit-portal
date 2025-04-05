import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { CreateClientDialogComponent } from './create-client-dialog/create-client-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatDialogModule, 
    MatButtonModule,
    MatIconModule
  ],
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
    private router: Router,
    private dialog: MatDialog
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

  openCreateClientDialog(): void {
    const dialogRef = this.dialog.open(CreateClientDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  openEditClientDialog(client: Client, event: Event): void {
    event.stopPropagation(); // Prevent row selection when clicking edit
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }
} 