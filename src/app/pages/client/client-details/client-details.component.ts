import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ClientDetailsComponent implements OnInit {
  client: Client | null = null;
  loading = false;
  error: string | null = null;
  activeTab: 'payment' | 'tax-filing' | 'documents' = 'payment';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClientDetails(+clientId);
    }
  }

  loadClientDetails(clientId: number): void {
    this.loading = true;
    this.error = null;

    this.clientService.getClientById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.error = 'Failed to load client details. Please try again.';
        this.loading = false;
        console.error('Error loading client details:', error);
      }
    });
  }

  setActiveTab(tab: 'payment' | 'tax-filing' | 'documents'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
