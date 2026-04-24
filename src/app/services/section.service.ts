import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private API = 'http://76.13.103.115:5000/api/sections';

  constructor(private http: HttpClient) {}

  // GET ALL (admin)
  getSections() {
    return this.http.get(this.API);
  }

  // CREATE
  createSection(data: any) {
    return this.http.post(this.API, data);
  }

  // UPDATE
  updateSection(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  // DELETE
  deleteSection(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  // OPTIONS (dropdown)
  getOptions() {
    return this.http.get(`${this.API}/options`);
  }

  // FRONTEND (optional)
  getFrontendSections() {
    return this.http.get(`${this.API}/frontend`);
  }
  
}