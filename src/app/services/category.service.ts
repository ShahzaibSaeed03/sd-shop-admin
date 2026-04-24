import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  baseUrl = 'http://76.13.103.115:5000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any>(this.baseUrl);
  }

  updateCategory(id: string, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }
}