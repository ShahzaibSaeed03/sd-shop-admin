import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API = 'https://api.sdshop.gg/api/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.API);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  // 🔥 NEW SEARCH API
  searchGames(query: string) {
    return this.http.get(`${this.API}/search?q=${query}`);
  }
  getByCategory(categoryId: string) {
  return this.http.get(`${this.API}/category/${categoryId}`);
}

syncProducts() {
  return this.http.get(`https://api.sdshop.gg/api/supplier/sync-products`, {});
}
}