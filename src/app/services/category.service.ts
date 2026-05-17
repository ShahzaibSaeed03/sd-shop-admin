import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  baseUrl = 'https://api.sdshop.gg/api/categories';

  gameInfoUrl = 'https://api.sdshop.gg/api/game-information';

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

  // ✅ UPDATE CATEGORY
  updateCategory(id: string, body: any) {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      body
    );
  }

  // ============================
  // GAME INFORMATION
  // ============================

  // ✅ GET GAME CONTENT
  getGameInformation(gameId: string) {
    return this.http.get<any>(
      `${this.gameInfoUrl}/${gameId}`
    );
  }

  // ✅ UPDATE GAME CONTENT
  updateGameInformation(
    gameId: string,
    body: any
  ) {
    return this.http.put(
      `${this.gameInfoUrl}/${gameId}`,
      body
    );
  }
}