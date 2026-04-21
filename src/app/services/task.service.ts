import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title }, {
      headers: this.getHeaders()
    });
  }

  updateTask(id: string, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { completed }, {
      headers: this.getHeaders()
    });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}