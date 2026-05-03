import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'https://api.sdshop.gg/api/auth'; // 🔥 change if needed

  constructor(private http: HttpClient) {}

  // ✅ LOGIN API
 login(data: { email: string; password: string }) {
  return firstValueFrom(
    this.http.post(`${this.API}/login`, data)
  );
}
}