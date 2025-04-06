import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DocumentService } from '../../../services/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-document-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Create Document</h2>
      
      <form [formGroup]="documentForm" (ngSubmit)="onSubmit()">
        <div mat-dialog-content>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Documents Required</mat-label>
            <textarea matInput formControlName="documentsRequired" rows="3" required></textarea>
            <mat-error *ngIf="documentForm.get('documentsRequired')?.hasError('required')">
              Documents Required is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Documents Pending</mat-label>
            <textarea matInput formControlName="documentsPending" rows="3" required></textarea>
            <mat-error *ngIf="documentForm.get('documentsPending')?.hasError('required')">
              Documents Pending is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Remarks</mat-label>
            <textarea matInput formControlName="remarks" rows="3"></textarea>
          </mat-form-field>
        </div>

        <div mat-dialog-actions align="end">
          <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="documentForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      min-width: 400px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    textarea {
      min-height: 80px;
    }

    mat-dialog-actions {
      margin-top: 20px;
      padding: 20px 0 0;
      border-top: 1px solid #eee;
    }
  `]
})
export class CreateDocumentDialogComponent {
  documentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDocumentDialogComponent>,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: { clientId: number }
  ) {
    this.documentForm = this.fb.group({
      documentsRequired: ['', Validators.required],
      documentsPending: ['', Validators.required],
      remarks: ['']
    });
  }

  onSubmit(): void {
    if (this.documentForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.documentForm.value;

    const document = {
      clientId: this.data.clientId,
      documentsRequired: formValue.documentsRequired,
      documentsPending: formValue.documentsPending,
      remarks: formValue.remarks || ''
    };

    this.documentService.createDocument(document).subscribe({
      next: (response) => {
        this.snackBar.open('Document created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.snackBar.open(`Error creating document: ${error.message || 'Unknown error'}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }
} 