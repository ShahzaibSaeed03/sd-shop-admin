import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardApi } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  loading = false;

  // 🔹 STATS
  stats = {
    failed: 0,
    pending: 0,
    total: 0,
    activeGames: 0,
  };

  // 🔹 WEBHOOK
  webhookFails = 0;

  // 🔹 TABLE DATA
  failedOrders: any[] = [];

  constructor(private dashboardApi: DashboardApi) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  // ==========================
  // 🔥 LOAD DASHBOARD
  // ==========================
  loadDashboard() {
    this.loading = true;

    this.dashboardApi.getDashboard().subscribe({
      next: (res: any) => {
        console.log('📊 DASHBOARD:', res);

        this.stats = res.stats || {};
        this.webhookFails = res.webhook?.last15MinFails || 0;
        this.failedOrders = res.ordersList || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Dashboard error:', err);
        this.loading = false;
      },
    });
  }

  // ==========================
  // 🔥 RETRY ORDER
  // ==========================
  retry(orderId: string) {
    if (!confirm('Retry this order?')) return;

    fetch(`/api/orders/${orderId}/retry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        this.loadDashboard(); // refresh
      })
      .catch((err) => console.error(err));
  }

  // ==========================
  // 🔥 PAGINATION (UI ONLY)
  // ==========================
  currentPage = 1;
  pageSize = 5;

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.failedOrders.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.failedOrders.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
