import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnDestroy {
  username = '';
  password = '';

  errorMessage = '';
  isBlocked = false;
  remainingSeconds = 0;
  private countdownInterval: any;

  constructor(private authService: AuthService, private router: Router) {
    this.startTimer();
  }

  login() {
    if (this.isBlocked) return;

    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.username = '';
        this.password = '';

        if (error.status === 429) {
          this.errorMessage = error.error?.error || 'Demasiados intentos. Inténtalo más tarde.';
          this.startBlockCountdown(10);
          return;
        }

        if (error.status === 401) {
          this.errorMessage = error.error?.error || 'Usuario o contraseña incorrectos';
          return;
        }

        this.errorMessage = 'Ha ocurrido un error. Inténtalo de nuevo.';
      }
    });
  }

  startTimer() {
    const stored = localStorage.getItem('login_block_until');

    if (!stored) return;

    const endTime = parseInt(stored, 10);

    this.countdownInterval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(this.countdownInterval);
        this.isBlocked = false;
        this.errorMessage = '';
        localStorage.removeItem('login_block_until');
        return;
      }

      this.remainingSeconds = remaining;
      this.isBlocked = true;
    }, 1000);
  }

  startBlockCountdown(seconds: number) {
    this.isBlocked = true;

    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem('login_block_until', endTime.toString());

    this.startTimer();
  }

  // Contador para ver cuanto nos queda de bloqueo
  get formattedCountdown(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}