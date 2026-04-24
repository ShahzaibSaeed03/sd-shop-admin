import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(
    private router: Router
  ) { }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  onLogout() {
    // 🔹 future me yahan token clear kar sakte ho
    // localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  isSidebarOpen = false;

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}

closeSidebarOnMobile() {
  if (window.innerWidth < 1024) {
    this.isSidebarOpen = false;
  }
}
}
