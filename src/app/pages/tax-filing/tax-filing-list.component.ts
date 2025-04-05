import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaxFilingService } from '../../services/tax-filing.service';
import { TaxFiling } from '../../models/tax-filing.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tax-filing-list',
  template: `
    <div class="tax-filing-container">
      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <table mat-table [dataSource]="taxFilings" class="tax-filing-table" *ngIf="!loading && !error">
        <ng-container matColumnDef="filingType">
          <th mat-header-cell *matHeaderCellDef>Filing Type</th>
          <td mat-cell *matCellDef="let filing">{{ filing.filingType }}</td>
        </ng-container>

        <ng-container matColumnDef="taxType">
          <th mat-header-cell *matHeaderCellDef>Tax Type</th>
          <td mat-cell *matCellDef="let filing">{{ filing.taxType }}</td>
        </ng-container>

        <ng-container matColumnDef="gstType">
          <th mat-header-cell *matHeaderCellDef>GST Type</th>
          <td mat-cell *matCellDef="let filing">{{ filing.gstType }}</td>
        </ng-container>

        <ng-container matColumnDef="deadline">
          <th mat-header-cell *matHeaderCellDef>Deadline</th>
          <td mat-cell *matCellDef="let filing">{{ filing.deadline | date:'mediumDate' }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let filing">
            <span class="status-badge" [ngClass]="getStatusClass(filing.status)">
              {{ filing.status }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="remarks">
          <th mat-header-cell *matHeaderCellDef>Remarks</th>
          <td mat-cell *matCellDef="let filing">{{ filing.remarks }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator
        *ngIf="!loading && !error && totalElements > 0"
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="currentPage"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (page)="onPageChange($event)"
        aria-label="Select page">
      </mat-paginator>

      <div *ngIf="!loading && !error && (!taxFilings || taxFilings.length === 0)" class="no-data">
        No tax filings found
      </div>
    </div>
  `,
  styles: [`
    .tax-filing-container {
      padding: 20px;
    }

    .tax-filing-table {
      width: 100%;
      margin-top: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .error-message {
      color: red;
      margin: 20px 0;
    }

    .no-data {
      text-align: center;
      margin: 20px 0;
      color: #666;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-pending {
      background-color: #fff3e0;
      color: #e65100;
    }

    .status-in-progress {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-completed {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatPaginatorModule
  ]
})
export class TaxFilingListComponent implements OnInit {
  taxFilings: TaxFiling[] = [];
  loading = false;
  error: string | null = null;
  displayedColumns = ['filingType', 'taxType', 'gstType', 'deadline', 'status', 'remarks'];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private taxFilingService: TaxFilingService
  ) {}

  ngOnInit(): void {
    this.loadTaxFilings();
  }

  loadTaxFilings(): void {
    const clientId = this.route.snapshot.paramMap.get('clientId');
    if (!clientId) {
      this.error = 'No client ID provided';
      return;
    }

    this.loading = true;
    this.error = null;

    this.taxFilingService.getTaxFilings(parseInt(clientId), this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Received tax filings:', response); // Debug log
        this.taxFilings = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tax filings:', error);
        this.error = 'Failed to load tax filings';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTaxFilings();
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status.toLowerCase().replace('_', '-');
    return `status-${normalizedStatus}`;
  }
} 