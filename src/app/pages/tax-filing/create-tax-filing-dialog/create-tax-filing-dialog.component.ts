import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TaxFilingService } from '../../../services/tax-filing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-tax-filing-dialog',
  template: `
    <div class="dialog-container mat-elevation-z4">
      <div class="dialog-header">
        <mat-icon class="header-icon">description</mat-icon>
        <h2>Create Tax Filing</h2>
      </div>
      
      <form [formGroup]="taxFilingForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Filing Type</mat-label>
            <input matInput formControlName="filingType" placeholder="Enter filing type" required>
            <mat-icon matSuffix>folder_open</mat-icon>
            <mat-error *ngIf="taxFilingForm.get('filingType')?.hasError('required')">
              Filing Type is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Tax Type</mat-label>
            <input matInput formControlName="taxType" placeholder="Enter tax type" required>
            <mat-icon matSuffix>receipt</mat-icon>
            <mat-error *ngIf="taxFilingForm.get('taxType')?.hasError('required')">
              Tax Type is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>GST Type</mat-label>
            <input matInput formControlName="gstType" placeholder="Enter GST type" required>
            <mat-icon matSuffix>account_balance</mat-icon>
            <mat-error *ngIf="taxFilingForm.get('gstType')?.hasError('required')">
              GST Type is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Deadline</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="deadline" required 
                   placeholder="Choose a date" [min]="minDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="taxFilingForm.get('deadline')?.hasError('required')">
              Deadline is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="PENDING">
                <div class="status-option">
                  <mat-icon class="status-icon pending">pending</mat-icon>
                  <span>Pending</span>
                </div>
              </mat-option>
              <mat-option value="IN_PROGRESS">
                <div class="status-option">
                  <mat-icon class="status-icon in-progress">loop</mat-icon>
                  <span>In Progress</span>
                </div>
              </mat-option>
              <mat-option value="COMPLETED">
                <div class="status-option">
                  <mat-icon class="status-icon completed">check_circle</mat-icon>
                  <span>Completed</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-error *ngIf="taxFilingForm.get('status')?.hasError('required')">
              Status is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field remarks">
            <mat-label>Remarks</mat-label>
            <textarea matInput formControlName="remarks" rows="3" 
                      placeholder="Enter any additional notes or remarks"></textarea>
            <mat-icon matSuffix>notes</mat-icon>
          </mat-form-field>
        </div>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="dialogRef.close()" class="cancel-button">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="isSubmitting || !taxFilingForm.valid" class="submit-button">
            {{ isSubmitting ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      background: #2c3e50;
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .form-container {
      padding: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-field {
      width: 100%;
    }

    .remarks {
      grid-column: 1;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .submit-button, .cancel-button {
      min-width: 100px;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: 500;
    }

    .submit-button {
      background: #2c3e50;
      color: white;
    }

    .submit-button:hover {
      background: #34495e;
    }

    .cancel-button {
      border: 1px solid #ddd;
    }

    .cancel-button:hover {
      background: #f5f5f5;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .status-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;

      &.pending {
        color: #f39c12;
      }

      &.in-progress {
        color: #3498db;
      }

      &.completed {
        color: #27ae60;
      }
    }

    ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }

      .mat-mdc-form-field-flex {
        background-color: white;
      }

      .mat-mdc-text-field-wrapper {
        background-color: white !important;
      }

      .mat-calendar {
        border-radius: 8px;
      }

      .mat-datepicker-content {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
        border-radius: 8px !important;
      }

      .mat-select-panel {
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
      }
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .remarks {
        grid-column: span 2;
      }
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule
  ],
  standalone: true
})
export class CreateTaxFilingDialogComponent {
  taxFilingForm: FormGroup;
  isSubmitting = false;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateTaxFilingDialogComponent>,
    private taxFilingService: TaxFilingService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) private data: { clientId: number }
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.taxFilingForm = this.fb.group({
      filingType: ['', Validators.required],
      taxType: ['', Validators.required],
      gstType: ['', Validators.required],
      deadline: [null, Validators.required],
      status: ['PENDING', Validators.required],
      remarks: ['']
    });
  }

  onSubmit(): void {
    if (this.taxFilingForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.taxFilingForm.value;
    
    // Convert date from DD/MM/YYYY to YYYY-MM-DD
    let deadline = formValue.deadline;
    if (deadline instanceof Date) {
      const year = deadline.getFullYear();
      const month = String(deadline.getMonth() + 1).padStart(2, '0');
      const day = String(deadline.getDate()).padStart(2, '0');
      deadline = `${year}-${month}-${day}`;
    }

    const taxFiling = {
      clientId: this.data.clientId,
      filingType: formValue.filingType,
      taxType: formValue.taxType,
      gstType: formValue.gstType,
      deadline: deadline,
      status: formValue.status,
      remarks: formValue.remarks || ''
    };

    this.taxFilingService.createTaxFiling(taxFiling).subscribe({
      next: (response) => {
        this.snackBar.open('Tax filing created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.snackBar.open(`Error creating tax filing: ${error.message || 'Unknown error'}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }
} 