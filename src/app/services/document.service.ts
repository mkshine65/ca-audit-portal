import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentResponse } from '../models/document.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getDocumentsByClientId(clientId: number, page: number = 0, size: number = 10): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.apiUrl}/client/${clientId}?page=${page}&size=${size}`);
  }
} 