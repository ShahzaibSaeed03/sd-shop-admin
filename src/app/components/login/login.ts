import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const res: any = await this.authService.login({
        email: this.email,
        password: this.password
      });

      // ✅ Save token
      localStorage.setItem('token', res.token);

      // ✅ Redirect
      this.router.navigate(['/dashboard']);

    } catch (err: any) {
      this.errorMessage =
        err?.error?.message || 'Invalid email or password';
    } finally {
      this.isLoading = false;
    }
  }
}