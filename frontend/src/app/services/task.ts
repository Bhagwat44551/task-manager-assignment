import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

const API_URL = 'https://task-manager-assignment-kb8u.onrender.com';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient, private auth: Auth) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(API_URL, { headers: this.authHeaders() });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(API_URL, task, { headers: this.authHeaders() });
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/${id}`, task, { headers: this.authHeaders() });
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/${id}`, { headers: this.authHeaders() });
  }
}
