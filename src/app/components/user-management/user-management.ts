import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {

  isAddUserOpen = false;

  users = [
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    {
      name: 'Ali Raza',
      email: 'ali.raza@company.com',
      role: 'Staff',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=2'
    },
    {
      name: 'Marcus Volt',
      email: 'marcus@company.com',
      role: 'User',
      status: 'Inactive',
      avatar: 'https://i.pravatar.cc/40?img=3'
    },
    {
      name: 'Julian Reed',
      email: 'julian@company.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=5'
    }
  ];
}
