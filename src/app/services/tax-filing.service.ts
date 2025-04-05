import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxFilingResponse } from '../models/tax-filing.model';
import { environment } from '../../environments/environment';

export interface TaxFiling {
  id: number;
  filingType: string;
  taxType: string;
  gstType: string;
  deadline: string;
  status: string;
  remarks: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaxFilingService {
  private apiUrl = `${environment.apiUrl}/tax-filings`;

  constructor(private http: HttpClient) {}

  getTaxFilings(page: number = 0, size: number = 10): Observable<TaxFilingResponse> {
    return this.http.get<TaxFilingResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getTaxFilingsByClientId(clientId: number, page: number = 0, size: number = 10): Observable<TaxFilingResponse> {
    return this.http.get<TaxFilingResponse>(`${this.apiUrl}/client/${clientId}?page=${page}&size=${size}`);
  }
} 