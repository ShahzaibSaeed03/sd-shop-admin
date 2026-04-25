import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API = 'http://76.13.103.115:5000/api/products';

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
  return this.http.get(`http://76.13.103.115:5000/api/supplier/sync-products`, {});
}
}