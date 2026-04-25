import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://76.13.103.115:5000/api/auth'; // 🔥 change if needed

  constructor(private http: HttpClient) {}

  // ✅ LOGIN API
 login(data: { email: string; password: string }) {
  return firstValueFrom(
    this.http.post(`${this.API}/login`, data)
  );
}
}