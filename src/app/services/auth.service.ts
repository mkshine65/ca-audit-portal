import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { username, password })
      .pipe(
        tap(() => this.isAuthenticatedSubject.next(true))
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/logout`, {}).pipe(
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }
}
