import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';
import { TaxFilingService } from '../../services/tax-filing.service';
import { PaymentService } from '../../services/payment.service';
import { DocumentService } from '../../services/document.service';
import { Client } from '../../models/client.model';
import { TaxFiling } from '../../models/tax-filing.model';
import { Payment } from '../../models/payment.model';
import { Document } from '../../models/document.model';
import { FormsModule } from '@angular/forms';
import { CreateTaxFilingDialogComponent } from '../tax-filing/create-tax-filing-dialog/create-tax-filing-dialog.component';
import { CreatePaymentDialogComponent } from '../payment/create-payment-dialog/create-payment-dialog.component';
import { TaxFilingResponse } from '../../services/tax-filing.service';
import { PaymentResponse } from '../../models/payment.model';
import { DocumentResponse } from '../../models/document.model';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule
  ],
  template: `
    <div class="client-details-container">
      <div class="header">
        <button class="back-button" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <div class="client-info" *ngIf="client">
          <h2>{{ client.companyName }}</h2>
          <p>Client ID: {{ client.id }}</p>
        </div>
      </div>

      <div class="tabs">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'tax-filings'"
          (click)="switchTab('tax-filings')">
          <i class="fas fa-file-invoice"></i> Tax Filings
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'payments'"
          (click)="switchTab('payments')">
          <i class="fas fa-credit-card"></i> Payments
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'documents'"
          (click)="switchTab('documents')">
          <i class="fas fa-folder"></i> Documents
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="activeTab === 'tax-filings'">
          <div class="table-actions">
            <button mat-raised-button color="primary" (click)="openCreateTaxFilingDialog()">
              <i class="fas fa-plus"></i> Create Tax Filing
            </button>
          </div>
          <div class="table-container" *ngIf="!loading">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Filing Type</th>
                  <th>Tax Type</th>
                  <th>GST Type</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let filing of taxFilings">
                  <td>{{ filing.id }}</td>
                  <td>{{ filing.filingType }}</td>
                  <td>{{ filing.taxType }}</td>
                  <td>{{ filing.gstType }}</td>
                  <td>{{ filing.deadline | date:'mediumDate' }}</td>
                  <td>
                    <span class="status-badge" [class]="getStatusClass(filing.status)">
                      {{ filing.status }}
                    </span>
                  </td>
                  <td>{{ filing.remarks }}</td>
                  <td>{{ filing.createdAt | date:'medium' }}</td>
                  <td>{{ filing.updatedAt | date:'medium' }}</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination-controls" *ngIf="taxFilingsTotalPages > 0">
              <div class="page-size-selector">
                <label>Items per page:</label>
                <select [(ngModel)]="taxFilingsPageSize" (ngModelChange)="onTaxFilingsPageSizeChange($event)">
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <div class="pagination">
                <button class="pagination-btn" 
                        [disabled]="taxFilingsCurrentPage === 0"
                        (click)="onTaxFilingsPageChange(taxFilingsCurrentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">
                  Page {{ taxFilingsCurrentPage + 1 }} of {{ taxFilingsTotalPages }}
                  ({{ taxFilingsTotalElements }} items)
                </span>
                <button class="pagination-btn"
                        [disabled]="taxFilingsCurrentPage === taxFilingsTotalPages - 1"
                        (click)="onTaxFilingsPageChange(taxFilingsCurrentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <div *ngIf="taxFilings.length === 0" class="no-data">
              No tax filings found
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'payments'">
          <div class="table-actions">
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
                  <th>Pending Amount</th>
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
                  <td>{{ payment.pendingAmount }}</td>
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
            <div class="pagination-controls" *ngIf="paymentsTotalPages > 0">
              <div class="page-size-selector">
                <label>Items per page:</label>
                <select [(ngModel)]="paymentsPageSize" (ngModelChange)="onPaymentsPageSizeChange($event)">
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <div class="pagination">
                <button class="pagination-btn" 
                        [disabled]="paymentsCurrentPage === 0"
                        (click)="onPaymentsPageChange(paymentsCurrentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">
                  Page {{ paymentsCurrentPage + 1 }} of {{ paymentsTotalPages }}
                  ({{ paymentsTotalElements }} items)
                </span>
                <button class="pagination-btn"
                        [disabled]="paymentsCurrentPage === paymentsTotalPages - 1"
                        (click)="onPaymentsPageChange(paymentsCurrentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'documents'">
          <div class="table-container" *ngIf="!loading">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Documents Required</th>
                  <th>Documents Pending</th>
                  <th>Remarks</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of documents">
                  <td>{{ doc.id }}</td>
                  <td>{{ doc.documentsRequired }}</td>
                  <td>{{ doc.documentsPending }}</td>
                  <td>{{ doc.remarks }}</td>
                  <td>{{ doc.createdAt | date:'medium' }}</td>
                  <td>{{ doc.lastUpdated | date:'medium' }}</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination-controls" *ngIf="documentsTotalPages > 0">
              <div class="page-size-selector">
                <label>Items per page:</label>
                <select [(ngModel)]="documentsPageSize" (ngModelChange)="onDocumentsPageSizeChange($event)">
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <div class="pagination">
                <button class="pagination-btn" 
                        [disabled]="documentsCurrentPage === 0"
                        (click)="onDocumentsPageChange(documentsCurrentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">
                  Page {{ documentsCurrentPage + 1 }} of {{ documentsTotalPages }}
                  ({{ documentsTotalElements }} items)
                </span>
                <button class="pagination-btn"
                        [disabled]="documentsCurrentPage === documentsTotalPages - 1"
                        (click)="onDocumentsPageChange(documentsCurrentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="loading-spinner">
          Loading...
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-details-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-button {
      padding: 8px 16px;
      border: none;
      background-color: #f0f0f0;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.3s;
    }

    .back-button:hover {
      background-color: #e0e0e0;
    }

    .client-info {
      text-align: right;
    }

    .client-info h2 {
      margin: 0;
      color: #333;
    }

    .client-info p {
      margin: 5px 0 0;
      color: #666;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }

    .tab-button {
      padding: 12px 24px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-button:hover {
      background-color: #f0f0f0;
    }

    .tab-button.active {
      background-color: #007bff;
      color: white;
    }

    .table-container {
      margin-top: 20px;
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
      white-space: nowrap;
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

    .status-badge.in-progress {
      background-color: #ffc107;
      color: #000;
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

    .pagination-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #dee2e6;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-size-selector select {
      padding: 6px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pagination-btn {
      padding: 6px 12px;
      border: 1px solid #dee2e6;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .pagination-btn:hover:not(:disabled) {
      background-color: #e9ecef;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      color: #6c757d;
    }

    .table-actions {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class ClientDetailsComponent implements OnInit {
  client: Client | null = null;
  activeTab = 'tax-filings';
  loading = false;
  error: string | null = null;

  taxFilings: TaxFiling[] = [];
  payments: Payment[] = [];
  documents: Document[] = [];

  paymentsCurrentPage = 0;
  paymentsPageSize = 10;
  paymentsTotalElements = 0;
  paymentsTotalPages = 0;

  documentsCurrentPage = 0;
  documentsPageSize = 10;
  documentsTotalElements = 0;
  documentsTotalPages = 0;

  taxFilingsCurrentPage = 0;
  taxFilingsPageSize = 10;
  taxFilingsTotalElements = 0;
  taxFilingsTotalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private clientService: ClientService,
    private taxFilingService: TaxFilingService,
    private paymentService: PaymentService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
      this.loadTaxFilings();
    }
  }

  loadClient(clientId: string): void {
    this.loading = true;
    this.error = null;

    this.clientService.getClient(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load client details. Please try again.';
        this.loading = false;
        console.error('Error loading client:', error);
      }
    });
  }

  loadTaxFilings(): void {
    if (!this.client) return;
    
    this.loading = true;
    this.error = null;
    this.taxFilingService.getTaxFilingsByClientId(this.client.id).subscribe({
      next: (response: TaxFilingResponse) => {
        this.taxFilings = response.content;
        this.taxFilingsTotalElements = response.totalElements;
        this.taxFilingsTotalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load tax filings';
        this.loading = false;
        console.error('Error loading tax filings:', error);
      }
    });
  }

  loadPayments(): void {
    if (!this.client) return;
    
    this.loading = true;
    this.error = null;
    this.paymentService.getPaymentsByClientId(this.client.id).subscribe({
      next: (response: PaymentResponse) => {
        this.payments = response.content;
        this.paymentsTotalElements = response.totalElements;
        this.paymentsTotalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load payments';
        this.loading = false;
        console.error('Error loading payments:', error);
      }
    });
  }

  loadDocuments(): void {
    if (!this.client) return;
    
    this.loading = true;
    this.error = null;
    this.documentService.getDocumentsByClientId(this.client.id).subscribe({
      next: (response: DocumentResponse) => {
        this.documents = response.content;
        this.documentsTotalElements = response.totalElements;
        this.documentsTotalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load documents';
        this.loading = false;
        console.error('Error loading documents:', error);
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (!this.client) return;

    switch (tab) {
      case 'tax-filings':
        this.loadTaxFilings();
        break;
      case 'payments':
        this.loadPayments();
        break;
      case 'documents':
        this.loadDocuments();
        break;
    }
  }

  onPaymentsPageChange(page: number): void {
    this.paymentsCurrentPage = page;
    this.loadTaxFilings();
  }

  onPaymentsPageSizeChange(size: number): void {
    this.paymentsPageSize = size;
    this.paymentsCurrentPage = 0;
    this.loadTaxFilings();
  }

  onDocumentsPageChange(page: number): void {
    this.documentsCurrentPage = page;
    this.loadDocuments();
  }

  onDocumentsPageSizeChange(size: number): void {
    this.documentsPageSize = size;
    this.documentsCurrentPage = 0;
    this.loadDocuments();
  }

  onTaxFilingsPageChange(page: number): void {
    this.taxFilingsCurrentPage = page;
    this.loadTaxFilings();
  }

  onTaxFilingsPageSizeChange(pageSize: number): void {
    this.taxFilingsPageSize = pageSize;
    this.taxFilingsCurrentPage = 0;
    this.loadTaxFilings();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'in_progress':
      case 'partially_paid':
        return 'in-progress';
      default:
        return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openCreateTaxFilingDialog(): void {
    if (!this.client) return;

    const dialogRef = this.dialog.open(CreateTaxFilingDialogComponent, {
      data: { clientId: this.client.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTaxFilings();
      }
    });
  }

  openCreatePaymentDialog(): void {
    if (!this.client) return;

    const dialogRef = this.dialog.open(CreatePaymentDialogComponent, {
      data: { clientId: this.client.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPayments();
      }
    });
  }
} 