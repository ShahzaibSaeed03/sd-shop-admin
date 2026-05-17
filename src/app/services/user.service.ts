import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl =
    'https://api.sdshop.gg/api/users';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // TOKEN
  // =========================

  getHeaders() {

    const token =
      localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // =========================
  // GET ALL USERS
  // =========================

  getUsers() {

    return this.http.get<any>(
      this.baseUrl,
      this.getHeaders()
    );
  }

  // =========================
  // USER DETAILS
  // =========================

  getUserDetails(id: string) {

    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }

  // =========================
  // UPDATE ROLE
  // =========================

  updateUserRole(
    id: string,
    role: string
  ) {

    return this.http.patch(
      `${this.baseUrl}/${id}/role`,
      { role },
      this.getHeaders()
    );
  }

  // =========================
  // DELETE USER
  // =========================

  deleteUser(id: string) {

    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }
}