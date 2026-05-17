import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-sync',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-sync.html',
  styleUrl: './supplier-sync.css',
})
export class SupplierSync {

  loading = false;

  cleanupLoading = false;

  result: any = null;

  cleanupResult: any = null;

  constructor(
    private supplierService: SupplierService
  ) {}

  // =========================
  // FULL SYNC
  // =========================
  runSync() {

    this.loading = true;

    this.result = null;

    this.supplierService
      .fullSync()
      .subscribe({

        next: (res: any) => {

          this.result = res;

          this.loading = false;
        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          alert('Sync failed');
        }

      });

  }

  // =========================
  // CLEANUP
  // =========================
  cleanupProducts() {

    const confirmDelete = confirm(
      'Are you sure you want to delete stale products?'
    );

    if (!confirmDelete) return;

    this.cleanupLoading = true;

    this.supplierService
      .cleanupStale(true)
      .subscribe({

        next: (res: any) => {

          this.cleanupResult = res;

          this.cleanupLoading = false;
        },

        error: (err) => {

          console.log(err);

          this.cleanupLoading = false;

          alert('Cleanup failed');
        }

      });

  }

}