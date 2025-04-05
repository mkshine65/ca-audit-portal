import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-create-client-dialog',
  template: `
    <h2 mat-dialog-title>Create New Client</h2>
    <mat-dialog-content>
      <form [formGroup]="clientForm" class="client-form">
        <mat-form-field appearance="fill">
          <mat-label>Company Name</mat-label>
          <input matInput formControlName="companyName" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Contact Person Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phoneNumber" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Address</mat-label>
          <textarea matInput formControlName="address" required></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!clientForm.valid">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .client-form {
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
    MatButtonModule
  ],
  standalone: true
})
export class CreateClientDialogComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateClientDialogComponent>,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      companyName: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = {
        ...this.clientForm.value,
        status: 'ACTIVE'
      };
      
      this.clientService.createClient(clientData).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating client:', error);
          // You might want to show an error message to the user here
        }
      });
    }
  }
} 