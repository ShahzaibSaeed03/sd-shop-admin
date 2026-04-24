import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  failed: number;
  pending: number;
  total: number;
  activeGames: number;
}

export interface FailedOrder {
  id: string;
  orderId: string;
  game: string;
  product: string;
  status: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  webhook: {
    last15MinFails: number;
  };
  failedOrdersList: FailedOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardApi {

  private baseUrl = 'http://76.13.103.115:5000/api/';

  constructor(private http: HttpClient) {}

  // ✅ MAIN DASHBOARD API
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}orders/dashboard`);
  }
   getLogs(page = 1, limit = 10) {
    return this.http.get(`${this.baseUrl}payments/logs?page=${page}&limit=${limit}`);
  }
  getOrderLogs(orderId: string) {
  return this.http.get(`${this.baseUrl}payments/order/${orderId}`);
}
}