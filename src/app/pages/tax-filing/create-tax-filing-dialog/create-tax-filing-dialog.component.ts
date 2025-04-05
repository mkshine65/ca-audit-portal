import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaxFilingService } from '../../../services/tax-filing.service';

@Component({
  selector: 'app-create-tax-filing-dialog',
  template: `
    <h2 mat-dialog-title>Create Tax Filing</h2>
    <mat-dialog-content>
      <form [formGroup]="taxFilingForm" class="tax-filing-form">
        <mat-form-field appearance="fill">
          <mat-label>Filing Type</mat-label>
          <input matInput formControlName="filingType" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Tax Type</mat-label>
          <input matInput formControlName="taxType" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>GST Type</mat-label>
          <input matInput formControlName="gstType" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Deadline</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="deadline" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="IN_PROGRESS">In Progress</mat-option>
            <mat-option value="COMPLETED">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Remarks</mat-label>
          <textarea matInput formControlName="remarks" required></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!taxFilingForm.valid">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tax-filing-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 16px 0;
    }
  `],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  standalone: true
})
export class CreateTaxFilingDialogComponent {
  taxFilingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaxFilingDialogComponent>,
    private taxFilingService: TaxFilingService,
    @Inject(MAT_DIALOG_DATA) private data: { clientId: number }
  ) {
    this.taxFilingForm = this.fb.group({
      filingType: ['', Validators.required],
      taxType: ['', Validators.required],
      gstType: ['', Validators.required],
      deadline: ['', Validators.required],
      status: ['PENDING', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taxFilingForm.valid) {
      const formValue = this.taxFilingForm.value;
      const taxFiling = {
        ...formValue,
        clientId: this.data.clientId,
        deadline: formValue.deadline.toISOString().split('T')[0] // Format date as YYYY-MM-DD
      };
      
      this.taxFilingService.createTaxFiling(taxFiling).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating tax filing:', error);
          // You might want to show an error message to the user here
        }
      });
    }
  }
} 