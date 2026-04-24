import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {

  order: any = null;
  logs: any[] = [];
  loading = true;
  logsLoading = true;

  API = 'http://76.13.103.115:5000/api/orders';
  LOG_API = 'http://76.13.103.115:5000/api/payments';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getOrder(id);
    this.getLogs(id);
  }

  // ==========================
  // GET ORDER
  // ==========================
  getOrder(id: any) {
    this.http.get(`${this.API}/${id}`).subscribe({
      next: (res: any) => {
        this.order = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // ==========================
  // GET LOGS (REAL)
  // ==========================
  getLogs(orderId: any) {
    this.http.get(`${this.LOG_API}/order/${orderId}`).subscribe({
      next: (res: any) => {
        this.logs = res.data || [];
        this.logsLoading = false;
      },
      error: () => this.logsLoading = false
    });
  }

  // ==========================
  // RETRY (FIXED CONDITION)
  // ==========================
  retryOrder() {
    if (!(this.order.status === 'paid' && this.order.supplierStatus !== 'completed')) return;

    this.http.post(`${this.API}/${this.order._id}/retry`, {})
      .subscribe(() => {
        this.getOrder(this.order._id);
        this.getLogs(this.order._id);
      });
  }

  // ==========================
  // STATUS HELPER
  // ==========================
  getLogStatus(log: any) {
    const type = log.payload?.type || '';

    if (type.includes('failed')) return 'ERROR';
    if (type.includes('succeeded')) return 'SUCCESS';

    return 'INFO';
  }

  // ==========================
  // DOWNLOAD JSON (WORKING)
  // ==========================
  downloadLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `order-${this.order._id}-logs.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  formatPrice(price: number) {
    return `$${price?.toLocaleString()}`;
  }

  goBack() {
    this.location.back();
  }
}