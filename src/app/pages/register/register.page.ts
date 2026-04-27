import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  name = '';
  email = '';
  username = '';
  password = '';

  // Comprueba si la contraseña cumple los requisitos mínimos de seguridad
  isStrongPassword(): boolean {
    const hasMinLength = this.password.length >= 8;
    const hasUppercase = /[A-Z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(this.password);

    return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
  }

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.name, this.email, this.username, this.password).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.password);
  }
}