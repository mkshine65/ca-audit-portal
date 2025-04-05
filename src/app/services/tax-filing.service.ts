import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError, map } from 'rxjs';
import { TaxFiling } from '../models/tax-filing.model';
import { environment } from '../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaxFilingService {
  private apiUrl = `${environment.apiUrl}/tax-filings`;

  constructor(private http: HttpClient) {
    console.log('TaxFilingService initialized with API URL:', this.apiUrl);
  }

  createTaxFiling(taxFiling: Omit<TaxFiling, 'id' | 'createdAt' | 'updatedAt'>): Observable<TaxFiling> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('accept', '*/*');

    console.log('Making POST request to:', this.apiUrl);
    console.log('Request Headers:', headers.keys().map(key => `${key}: ${headers.get(key)}`));
    console.log('Request Body:', JSON.stringify(taxFiling, null, 2));

    return this.http.post<TaxFiling>(this.apiUrl, taxFiling, { 
      headers,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Full API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          body: response.body
        });
      }),
      map(response => response.body as TaxFiling),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  getTaxFilings(clientId: number, page: number = 0, size: number = 10): Observable<PageResponse<TaxFiling>> {
    const url = `${this.apiUrl}/client/${clientId}`;
    console.log('Making GET request to:', url);
    
    return this.http.get<PageResponse<TaxFiling>>(url, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    }).pipe(
      tap({
        next: (response) => console.log('GET Response:', response),
        error: (error: HttpErrorResponse) => console.error('GET Error:', error)
      })
    );
  }
} 