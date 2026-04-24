import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stability-dashboard',
  imports: [],
  templateUrl: './stability-dashboard.html',
  styleUrl: './stability-dashboard.css',
})
export class StabilityDashboard {
  constructor(private router: Router) { }

  goToWebhookLogs() {
    this.router.navigate(['/payment-stability']);
  }

}
