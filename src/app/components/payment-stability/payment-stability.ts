import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardApi } from '../../services/dashboard.service';

@Component({
  selector: 'app-payment-stability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-stability.html',
})
export class PaymentStability implements OnInit {

  logs: any[] = [];
  filteredLogs: any[] = [];
  successCount = 0;
  failedCount = 0;

  activeTab: 'all' | 'success' | 'failed' = 'all';

  currentPage = 1;
  pageSize = 10;

  loading = false;

  constructor(private api: DashboardApi) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;

    this.api.getLogs().subscribe({
      next: (res: any) => {
        this.logs = res.data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  calculateCounts() {
    this.successCount = this.logs.filter(
      (log: any) => this.getStatus(log) === 'SUCCESS'
    ).length;

    this.failedCount = this.logs.filter(
      (log: any) => this.getStatus(log) === 'FAILED'
    ).length;
  }
  downloadLogs() {
    if (!this.logs || this.logs.length === 0) {
      alert('No logs to download');
      return;
    }

    // convert to JSON
    const json = JSON.stringify(this.logs, null, 2);

    // create blob
    const blob = new Blob([json], { type: 'application/json' });

    // create download link
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-logs-${new Date().toISOString()}.json`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  // ==========================
  // STATUS
  // ==========================
  getStatus(log: any): 'SUCCESS' | 'FAILED' | 'OK' {
    const type = log.payload?.type || '';

    if (type.includes('failed')) return 'FAILED';
    if (type.includes('succeeded')) return 'SUCCESS';

    return 'OK';
  }

  // ==========================
  // FILTER
  // ==========================
  setTab(tab: 'all' | 'success' | 'failed') {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeTab === 'all') {
      this.filteredLogs = this.logs;
    } else if (this.activeTab === 'success') {
      this.filteredLogs = this.logs.filter(l => this.getStatus(l) === 'SUCCESS');
    } else {
      this.filteredLogs = this.logs.filter(l => this.getStatus(l) === 'FAILED');
    }
  }

  // ==========================
  // PAGINATION
  // ==========================
  get paginatedLogs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredLogs.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}