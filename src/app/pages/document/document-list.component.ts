import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-list-container">
      <h2>Documents</h2>
      <p>Document functionality coming soon...</p>
    </div>
  `,
  styles: [`
    .document-list-container {
      padding: 20px;
    }
  `]
})
export class DocumentListComponent {} 