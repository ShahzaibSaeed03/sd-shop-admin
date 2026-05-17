import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
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
    private authService: AuthService,
  ) {}

  async onLogin() {
    this.errorMessage = '';

    // 🔹 Validation
    if (!this.email?.trim()) {
      this.errorMessage = 'Por favor, informe seu e-mail.';
      return;
    }
    if (!this.password?.trim()) {
      this.errorMessage = 'Por favor, informe sua senha.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.errorMessage = 'Formato de e-mail inválido.';
      return;
    }

    this.isLoading = true;

    try {
      // 🔹 Handle both Observable and Promise returns
      const loginCall: any = this.authService.login({
        email: this.email.trim(),
        password: this.password,
      });

      const res: any =
        loginCall && typeof loginCall.subscribe === 'function'
          ? await firstValueFrom(loginCall)
          : await loginCall;

      // 🔹 Validate response
      if (!res || (!res.token && !res.accessToken)) {
        this.errorMessage = 'Senha ou e-mail inválidos.';
        return;
      }

      const token = res.token || res.accessToken;
      const user = res.user || res.admin || {};

      // 🔹 Role check — only admins allowed
      if (user.role && user.role !== 'admin' && user.role !== 'superadmin') {
        this.errorMessage = 'Acesso negado. Apenas administradores podem entrar.';
        return;
      }

      // 🔹 Save token + admin user
      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', JSON.stringify({
        _id: user._id,
        name: user.name || 'Admin',
        email: user.email || this.email,
        picture: user.picture || user.avatar || null,
        role: user.role || 'admin',
      }));

      // 🔹 Redirect
      this.router.navigate(['/dashboard']);

    } catch (err: any) {
      console.error('[Login] Authentication error:', err);

      const status = err?.status;
      const backendMsg = err?.error?.message;

      if (status === 401 || status === 403) {
        this.errorMessage = 'Senha ou e-mail inválidos.';
      } else if (status === 404) {
        this.errorMessage = 'Usuário não encontrado.';
      } else if (status === 0 || status >= 500) {
        this.errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      } else {
        this.errorMessage = backendMsg || 'Senha ou e-mail inválidos.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  onGoogleLogin() {
    // 🔹 Placeholder — Google login package abhi install nahi hai
    this.errorMessage = 'Login com Google em breve.';

    // Auto-clear message after 3 seconds
    setTimeout(() => {
      if (this.errorMessage === 'Login com Google em breve.') {
        this.errorMessage = '';
      }
    }, 3000);
  }
}