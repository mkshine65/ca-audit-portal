import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, ClientResponse } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(page: number = 0, size: number = 10): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }
} 