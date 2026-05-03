import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://api.sdshop.gg/api'; // 🔥 change to your backend URL

  constructor(private http: HttpClient) {}

  // 🔥 common headers (token support)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // 🔥 GET
  get(endpoint: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  // 🔥 POST
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  // 🔥 PUT
  put(endpoint: string, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  // 🔥 DELETE
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 FILE UPLOAD (important for banner image)
  upload(endpoint: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
      // ❌ don't set Content-Type (browser auto handles multipart)
    });

    return this.http.post(`${this.baseUrl}${endpoint}`, formData, {
      headers
    });
  }
}