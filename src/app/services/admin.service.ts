import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBlockedUsers: number;
  totalTasks: number;
  totalCategories: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    });
  }

  getUsers(search: string = '', blocked: boolean = false): Observable<any[]> {
    let url = `${this.apiUrl}/users`;

    const params = [];

    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (blocked) {
      params.push('blocked=true');
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<any[]>(url, {
      headers: this.getHeaders()
    });
  }

  unblockUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/unblock`, {}, {
      headers: this.getHeaders()
    });
  }

  changeRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/role`, { role }, {
      headers: this.getHeaders()
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders()
    });
  }
}