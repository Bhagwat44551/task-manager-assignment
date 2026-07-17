import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'https://task-manager-assignment-kb8u.onrender.com/api/auth';
const TOKEN_KEY = 'tm_token';
const USERNAME_KEY = 'tm_username';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // signal so components can reactively check login state
  isLoggedIn = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));
  currentUsername = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/register`, { username, password })
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/login`, { username, password })
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USERNAME_KEY, res.username);
    this.isLoggedIn.set(true);
    this.currentUsername.set(res.username);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.isLoggedIn.set(false);
    this.currentUsername.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
