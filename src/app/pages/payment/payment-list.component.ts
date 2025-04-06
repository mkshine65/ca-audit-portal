import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';
import { ActivatedRoute } from '@angular/router';
import { CreatePaymentDialogComponent } from './create-payment-dialog/create-payment-dialog.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="payment-list-container">
      <div class="header">
        <h2>Payments</h2>
        <button mat-raised-button color="primary" (click)="openCreatePaymentDialog()">
          <i class="fas fa-plus"></i> Create Payment
        </button>
      </div>
      
      <div class="table-container" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Amount</th>
              <th>Received Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Financial Year</th>
              <th>Remarks</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of payments">
              <td>{{ payment.id }}</td>
              <td>{{ payment.totalAmount }}</td>
              <td>{{ payment.receivedAmount }}</td>
              <td>
                <span class="status-badge" [class]="getStatusClass(payment.paymentStatus)">
                  {{ payment.paymentStatus }}
                </span>
              </td>
              <td>{{ payment.paymentDate | date:'mediumDate' }}</td>
              <td>{{ payment.financialYear }}</td>
              <td>{{ payment.remarks }}</td>
              <td>{{ payment.createdAt | date:'medium' }}</td>
              <td>{{ payment.lastUpdated | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        Loading...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .payment-list-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.completed {
      background-color: #28a745;
      color: white;
    }

    .status-badge.pending {
      background-color: #dc3545;
      color: white;
    }

    .status-badge.partially-paid {
      background-color: #ffc107;
      color: black;
    }

    .loading-spinner {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      padding: 10px;
      margin: 20px 0;
      border: 1px solid #dc3545;
      border-radius: 4px;
      background-color: #f8d7da;
    }
  `]
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  error: string | null = null;
  clientId: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.loadPayments();
    }
  }

  loadPayments(): void {
    if (!this.clientId) return;
    
    this.loading = true;
    this.error = null;
    this.paymentService.getPaymentsByClientId(+this.clientId).subscribe({
      next: (response) => {
        this.payments = response.content;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load payments';
        this.loading = false;
        console.error('Error loading payments:', error);
      }
    });
  }

  openCreatePaymentDialog(): void {
    if (!this.clientId) return;

    const dialogRef = this.dialog.open(CreatePaymentDialogComponent, {
      data: { clientId: +this.clientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPayments();
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'partially_paid':
        return 'partially-paid';
      default:
        return '';
    }
  }
} 