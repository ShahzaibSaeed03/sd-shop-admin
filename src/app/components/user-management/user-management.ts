import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import { UserService }
from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement
implements OnInit {

  isAddUserOpen = false;

  loading = false;

  users: any[] = [];

  selectedUser: any = null;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.loadUsers();
  }

  // =========================
  // LOAD USERS
  // =========================

  loadUsers() {

    this.loading = true;

    this.userService
      .getUsers()
      .subscribe({

        next: (res: any) => {

          this.users = res || [];

          this.loading = false;
        },

        error: () => {

          this.loading = false;
        }
      });
  }

  // =========================
  // USER DETAILS
  // =========================

  openDetails(user: any) {

    this.userService
      .getUserDetails(user._id)
      .subscribe({

        next: (res) => {

          this.selectedUser = res;
        }
      });
  }

  // =========================
  // UPDATE ROLE
  // =========================

  changeRole(
    user: any,
    event: any
  ) {

    const role =
      event.target.value;

    this.userService
      .updateUserRole(
        user._id,
        role
      )
      .subscribe({

        next: () => {

          user.role = role;
        }
      });
  }

  // =========================
  // DELETE
  // =========================

  deleteUser(user: any) {

    const confirmDelete =
      confirm(
        `Delete ${user.name}?`
      );

    if (!confirmDelete) return;

    this.userService
      .deleteUser(user._id)
      .subscribe({

        next: () => {

          this.users =
            this.users.filter(
              u => u._id !== user._id
            );
        }
      });
  }
get totalPaidAmount(): number {

  if (!this.selectedUser?.purchasedProducts) {
    return 0;
  }

  return this.selectedUser.purchasedProducts
    .filter((x: any) => x.status === 'paid')
    .reduce((sum: number, item: any) => {
      return sum + Number(item.paidAmount || 0);
    }, 0);

}
  // =========================
  // CLOSE DETAILS
  // =========================

  closeDetails() {

    this.selectedUser = null;
  }
}