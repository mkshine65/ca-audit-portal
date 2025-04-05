import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../models/payment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPaymentsByClientId(clientId: number, page: number = 0, size: number = 10): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/client/${clientId}?page=${page}&size=${size}`);
  }
} 