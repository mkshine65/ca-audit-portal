import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaxFiling } from '../models/tax-filing.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxFilingService {
  private apiUrl = `${environment.apiUrl}/tax-filings`;

  constructor(private http: HttpClient) {}

  createTaxFiling(taxFiling: Omit<TaxFiling, 'id' | 'createdAt' | 'updatedAt'>): Observable<TaxFiling> {
    return this.http.post<TaxFiling>(this.apiUrl, taxFiling);
  }

  getTaxFilings(clientId: number): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${this.apiUrl}?clientId=${clientId}`);
  }
} 