import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  isSidebarOpen = false;
  adminUser: any = null;
  adminInitials: string = 'AU';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadAdminUser();

    // 🔄 Listen for storage changes (e.g. login from another tab / after Google login)
    window.addEventListener('storage', () => this.loadAdminUser());
  }

  loadAdminUser() {
    try {
      const raw = localStorage.getItem('adminUser');
      if (raw) {
        this.adminUser = JSON.parse(raw);
        this.adminInitials = this.computeInitials(this.adminUser?.name);
      } else {
        this.adminUser = null;
        this.adminInitials = 'AU';
      }
    } catch (err) {
      console.warn('[Sidebar] Failed to parse adminUser:', err);
      this.adminUser = null;
    }
  }

  computeInitials(name?: string): string {
    if (!name) return 'AU';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  onPictureError() {
    // If Google profile picture fails to load, fall back to initials
    if (this.adminUser) {
      this.adminUser = { ...this.adminUser, picture: null };
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }
}