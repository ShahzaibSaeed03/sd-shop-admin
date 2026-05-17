import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BundleService {

  private API =
    'https://api.sdshop.gg/api/bundles';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // GET ALL
  // =========================

  getBundles() {
    return this.http.get(this.API);
  }

  // =========================
  // GET ONE
  // =========================

  getBundle(id: string) {
    return this.http.get(
      `${this.API}/${id}`
    );
  }

  // =========================
  // CREATE
  // =========================

  createBundle(data: FormData) {
    return this.http.post(
      this.API,
      data
    );
  }

  // =========================
  // UPDATE
  // =========================

  updateBundle(
    id: string,
    data: FormData
  ) {
    return this.http.put(
      `${this.API}/${id}`,
      data
    );
  }

  // =========================
  // DELETE
  // =========================

  deleteBundle(id: string) {
    return this.http.delete(
      `${this.API}/${id}`
    );
  }
}