import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-list-container">
      <h2>Payments</h2>
      <p>Payment functionality coming soon...</p>
    </div>
  `,
  styles: [`
    .payment-list-container {
      padding: 20px;
    }
  `]
})
export class PaymentListComponent {} 