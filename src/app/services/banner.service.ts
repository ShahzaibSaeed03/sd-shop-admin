import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private API = 'http://localhost:5000/api/banners';

  constructor(private http: HttpClient) {}

  getBanners(section: string) {
    return this.http.get(`${this.API}?section=${section}`);
  }

  createBanner(data: any) {
    return this.http.post(this.API, data);
  }

  updateBanner(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteBanner(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  // 🔥 REORDER API
  reorder(data: any[]) {
    return this.http.put(`${this.API}/reorder`, data);
  }
}