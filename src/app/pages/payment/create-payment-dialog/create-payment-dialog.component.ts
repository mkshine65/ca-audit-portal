import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { PaymentService } from '../../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Create Payment</h2>
      
      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
        <div mat-dialog-content>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Total Amount</mat-label>
            <input matInput type="number" formControlName="totalAmount" required>
            <mat-error *ngIf="paymentForm.get('totalAmount')?.hasError('required')">
              Total Amount is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Received Amount</mat-label>
            <input matInput type="number" formControlName="receivedAmount" required>
            <mat-error *ngIf="paymentForm.get('receivedAmount')?.hasError('required')">
              Received Amount is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Payment Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="paymentDate" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="paymentForm.get('paymentDate')?.hasError('required')">
              Payment Date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Financial Year</mat-label>
            <input matInput formControlName="financialYear" required>
            <mat-error *ngIf="paymentForm.get('financialYear')?.hasError('required')">
              Financial Year is required
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
                  [disabled]="paymentForm.invalid || isSubmitting">
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
export class CreatePaymentDialogComponent {
  paymentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePaymentDialogComponent>,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) private data: { clientId: number }
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.paymentForm = this.fb.group({
      totalAmount: ['', Validators.required],
      receivedAmount: ['', Validators.required],
      paymentDate: [new Date(), Validators.required],
      financialYear: ['', Validators.required],
      remarks: ['']
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.paymentForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.paymentForm.value;
    
    // Ensure we're working with a Date object and format it correctly
    const paymentDate = formValue.paymentDate instanceof Date 
      ? formValue.paymentDate 
      : new Date(formValue.paymentDate);

    const payment = {
      clientId: this.data.clientId,
      totalAmount: formValue.totalAmount,
      receivedAmount: formValue.receivedAmount,
      paymentDate: this.formatDate(paymentDate),
      financialYear: formValue.financialYear,
      remarks: formValue.remarks || ''
    };

    console.log('Sending payment:', payment); // Add logging to verify the date format

    this.paymentService.createPayment(payment).subscribe({
      next: (response) => {
        this.snackBar.open('Payment created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.snackBar.open(`Error creating payment: ${error.message || 'Unknown error'}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }
} 