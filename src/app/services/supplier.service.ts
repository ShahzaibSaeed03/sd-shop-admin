import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private API =
    'https://api.sdshop.gg/api/supplier';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // FULL SYNC
  // =========================
  fullSync() {

    return this.http.get(
      `${this.API}/full-sync`
    );

  }

  // =========================
  // SYNC PRODUCTS ONLY
  // =========================
  syncProducts() {

    return this.http.get(
      `${this.API}/sync-products`
    );

  }

  // =========================
  // SYNC CATEGORIES ONLY
  // =========================
  syncCategories() {

    return this.http.get(
      `${this.API}/sync-categories`
    );

  }

  // =========================
  // GET SUPPLIER CATEGORIES
  // =========================
  getCategories() {

    return this.http.get(
      `${this.API}/categories`
    );

  }

  // =========================
  // CLEANUP OLD PRODUCTS
  // =========================
  cleanupStale(
    confirm: boolean = false
  ) {

    return this.http.get(
      `${this.API}/cleanup-stale?confirm=${
        confirm ? 'yes' : 'no'
      }`
    );

  }

}