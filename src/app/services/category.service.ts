import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  baseUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  // ✅ GET ALL
  getCategories() {
    return this.http.get<any>(this.baseUrl);
  }

  // ✅ GET BY ID
  getCategoryById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ SEARCH
  searchCategories(query: string) {
    return this.http.get<any>(`${this.baseUrl}/search?q=${query}`);
  }

  // ✅ UPDATE
  updateCategory(id: string, body: any) {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }
}