import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientResponse } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getClients(page: number = 0, size: number = 10): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.apiUrl}/clients?page=${page}&size=${size}`);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }
} 