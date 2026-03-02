import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AuthResponse, User, RegisterDto, LoginDto } from '@sas-platform/shared-dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/v1/auth';

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(res => this.setToken(res.access_token))
    );
  }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap(res => this.setToken(res.access_token))
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  logout() {
    localStorage.removeItem('token');
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
