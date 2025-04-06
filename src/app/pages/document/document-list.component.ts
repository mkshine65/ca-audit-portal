import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ActivatedRoute } from '@angular/router';
import { CreateDocumentDialogComponent } from './create-document-dialog/create-document-dialog.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="document-list-container">
      <div class="header">
        <h2>Documents</h2>
        <button mat-raised-button color="primary" (click)="openCreateDocumentDialog()">
          <i class="fas fa-plus"></i> Create Document
        </button>
      </div>
      
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
            <tr *ngFor="let document of documents">
              <td>{{ document.id }}</td>
              <td>{{ document.documentsRequired }}</td>
              <td>{{ document.documentsPending }}</td>
              <td>{{ document.remarks }}</td>
              <td>{{ document.createdAt | date:'medium' }}</td>
              <td>{{ document.lastUpdated | date:'medium' }}</td>
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
    .document-list-container {
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
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  error: string | null = null;
  clientId: string | null = null;

  constructor(
    private documentService: DocumentService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.loadDocuments();
    }
  }

  loadDocuments(): void {
    if (!this.clientId) return;
    
    this.loading = true;
    this.error = null;
    this.documentService.getDocumentsByClientId(+this.clientId).subscribe({
      next: (response) => {
        this.documents = response.content;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load documents';
        this.loading = false;
        console.error('Error loading documents:', error);
      }
    });
  }

  openCreateDocumentDialog(): void {
    if (!this.clientId) return;

    const dialogRef = this.dialog.open(CreateDocumentDialogComponent, {
      data: { clientId: +this.clientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDocuments();
      }
    });
  }
} 