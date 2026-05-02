import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit {

  orders: any[] = [];
  loading = false;
  toggleDropdown = false;
  page = 1;
  limit = 10;
  total = 0;

  selectedStatus = 'all';

  API = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.loadOrders();
  }

  // ✅ LOAD ORDERS
  games: string[] = [];
  selectedGame: string = '';

  loadOrders() {
    this.loading = true;

    this.http.get(`${this.API}?page=${this.page}&limit=${this.limit}&status=${this.selectedStatus}`)
      .subscribe((res: any) => {

        const data = res.data || [];

        this.orders = data;
        this.total = res.total || 0;

        // ✅ extract unique games
        const allGames: string[] = data.map((o: any) => String(o.productName || 'Unknown')); 
        this.games = [...new Set(allGames)];

        this.loading = false;
      });
  }

  // ✅ FILTER BY GAME
  filterByGame(game: string) {
    this.selectedGame = game;

    this.orders = this.orders.filter(
      (o: any) => (o.productName || 'Unknown') === game
    );
  }

  // ✅ CLEAR FILTER
  clearGameFilter() {
    this.selectedGame = '';
    this.loadOrders();
  }

  // ✅ FILTER
  changeStatus(status: string) {
    this.selectedStatus = status;
    this.page = 1;
    this.loadOrders();
  }

  // ✅ RETRY
  retryOrder(order: any) {
    if (order.status !== 'failed') return;

    order.loading = true;

    this.http.post(`${this.API}/${order.id}/retry`, {})
      .subscribe({
        next: () => {
          order.loading = false;
          this.loadOrders();
        },
        error: (err) => {
          console.error(err);
          order.loading = false;
        }
      });
  }

  // ✅ VIEW

viewOrder(order: any) {
  if (!order?.id) {
    console.error('Order ID missing', order);
    return;
  }

  this.router.navigate(['/orders', order.id]); // ✅ use id not _id
}
  // ✅ PAGINATION
  next() {
    this.page++;
    this.loadOrders();
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }

  // ✅ FORMAT
  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatPrice(price: number) {
    return `$${price.toLocaleString()}`;
  }
}