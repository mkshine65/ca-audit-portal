import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon>description</mat-icon>
        <h2>Create Tax Filing</h2>
      </div>
      
      <form [formGroup]="taxFilingForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Filing Type</mat-label>
            <input matInput formControlName="filingType" placeholder="Enter filing type">
            <mat-icon matSuffix>folder_open</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Tax Type</mat-label>
            <input matInput formControlName="taxType" placeholder="Enter tax type">
            <mat-icon matSuffix>receipt</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>GST Type</mat-label>
            <input matInput formControlName="gstType" placeholder="Enter GST type">
            <mat-icon matSuffix>account_balance</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Deadline</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="deadline">
            <mat-hint>YYYY-MM-DD</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
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
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field remarks">
            <mat-label>Remarks</mat-label>
            <textarea matInput formControlName="remarks" rows="3" 
                      placeholder="Enter any additional notes or remarks"></textarea>
            <mat-icon matSuffix>notes</mat-icon>
          </mat-form-field>
        </div>

        <div class="dialog-actions">
          <button mat-button type="button" mat-dialog-close class="cancel-button">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="isSubmitting" class="submit-button">
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
      max-width: 800px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      background: linear-gradient(135deg, #1976d2, #2196f3);
      color: white;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .dialog-header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .form-container {
      padding: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-field {
      width: 100%;
    }

    .remarks {
      grid-column: span 2;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .submit-button, .cancel-button {
      min-width: 120px;
      border-radius: 20px;
    }

    .submit-button {
      background: linear-gradient(135deg, #1976d2, #2196f3);
    }

    .cancel-button {
      border: 1px solid #e0e0e0;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-icon {
      &.pending { color: #f57c00; }
      &.in-progress { color: #1976d2; }
      &.completed { color: #43a047; }
    }

    ::ng-deep {
      .mat-form-field-wrapper {
        margin: 0;
      }

      .mat-form-field-appearance-outline .mat-form-field-flex {
        background-color: white;
        border-radius: 4px;
      }

      .mat-datepicker-toggle {
        color: #1976d2;
      }

      .mat-calendar {
        border-radius: 8px;
      }

      .mat-datepicker-content {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .remarks {
        grid-column: 1;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        
        button {
          width: 100%;
        }
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaxFilingDialogComponent>,
    private taxFilingService: TaxFilingService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) private data: { clientId: number }
  ) {
    console.log('Dialog opened with clientId:', this.data.clientId);
    this.dateAdapter.setLocale('en-GB'); // Use UK locale for DD/MM/YYYY format
    this.taxFilingForm = this.fb.group({
      filingType: [''],
      taxType: [''],
      gstType: [''],
      deadline: [null],
      status: ['PENDING'],
      remarks: ['']
    });
  }

  onSubmit(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.taxFilingForm.value;
      const deadline = formValue.deadline instanceof Date 
        ? formValue.deadline.toISOString().split('T')[0] 
        : formValue.deadline;

      const taxFiling = {
        clientId: this.data.clientId,
        filingType: formValue.filingType || '',
        taxType: formValue.taxType || '',
        gstType: formValue.gstType || '',
        deadline: deadline || '',
        status: formValue.status || 'PENDING',
        remarks: formValue.remarks || ''
      };

      console.log('Calling tax filing service with data:', taxFiling);
      
      this.taxFilingService.createTaxFiling(taxFiling).subscribe({
        next: (response) => {
          console.log('API call successful. Response:', response);
          this.snackBar.open('Tax filing created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('API call failed. Error:', error);
          this.snackBar.open(`Error creating tax filing: ${error.message || 'Unknown error'}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        },
        complete: () => {
          console.log('API call completed');
          this.isSubmitting = false;
        }
      });
    }
  }
} 