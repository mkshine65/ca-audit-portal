import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxFilingService } from '../../services/tax-filing.service';
import { TaxFiling } from '../../models/tax-filing.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tax-filing-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tax-filing-container">
      <div class="header">
        <h2>Tax Filings</h2>
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="loading" class="loading-spinner">
        Loading...
      </div>

      <div class="tax-filing-table" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client ID</th>
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
              <td>{{ filing.clientId }}</td>
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

        <div *ngIf="taxFilings.length === 0" class="no-data">
          No tax filings found
        </div>

        <div class="pagination-controls" *ngIf="totalPages > 0">
          <div class="page-size-selector">
            <label>Items per page:</label>
            <select [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange($event)">
              <option [ngValue]="10">10</option>
              <option [ngValue]="20">20</option>
              <option [ngValue]="50">50</option>
            </select>
          </div>

          <div class="pagination">
            <button class="pagination-btn" 
                    [disabled]="currentPage === 0"
                    (click)="onPageChange(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <span class="pagination-info">
              Page {{ currentPage + 1 }} of {{ totalPages }}
              ({{ totalElements }} items)
            </span>
            
            <button class="pagination-btn"
                    [disabled]="currentPage === totalPages - 1"
                    (click)="onPageChange(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tax-filing-container {
      padding: 20px;
    }

    .header {
      margin-bottom: 20px;
    }

    .error-message {
      color: #dc3545;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #dc3545;
      border-radius: 4px;
      background-color: #f8d7da;
    }

    .loading-spinner {
      text-align: center;
      padding: 20px;
      color: #666;
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

    .status-badge.in-progress {
      background-color: #ffc107;
      color: #000;
    }

    .status-badge.completed {
      background-color: #28a745;
      color: white;
    }

    .status-badge.pending {
      background-color: #dc3545;
      color: white;
    }

    .no-data {
      text-align: center;
      padding: 20px;
      color: #666;
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
  `]
})
export class TaxFilingListComponent implements OnInit {
  taxFilings: TaxFiling[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private taxFilingService: TaxFilingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTaxFilings();
  }

  loadTaxFilings(): void {
    this.loading = true;
    this.error = null;

    const clientId = this.route.snapshot.paramMap.get('id');
    
    const observable = clientId ? 
      this.taxFilingService.getTaxFilingsByClientId(+clientId, this.currentPage, this.pageSize) :
      this.taxFilingService.getTaxFilings(this.currentPage, this.pageSize);

    observable.subscribe({
      next: (response) => {
        this.taxFilings = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load tax filings. Please try again.';
        this.loading = false;
        console.error('Error loading tax filings:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTaxFilings();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadTaxFilings();
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'COMPLETED':
        return 'completed';
      case 'PENDING':
        return 'pending';
      default:
        return '';
    }
  }
} 