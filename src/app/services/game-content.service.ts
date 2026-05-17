import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameContentService {

  // ✅ CHANGE THIS
  private apiUrl = 'YOUR_API_URL/categories';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // GET ALL GAMES
  // =========================

  getGames(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // =========================
  // GET SINGLE GAME
  // =========================

  getGameById(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // UPDATE GAME CONTENT
  // =========================

  updateGameContent(
    id: string,
    payload: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/game-information`,
      payload
    );
  }
}