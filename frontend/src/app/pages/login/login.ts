import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  isRegisterMode = signal(false);
  errorMessage = signal('');

  constructor(private auth: Auth, private router: Router) {}

  toggleMode() {
    this.isRegisterMode.set(!this.isRegisterMode());
    this.errorMessage.set('');
  }

  submit() {
    this.errorMessage.set('');

    if (!this.username || !this.password) {
      this.errorMessage.set('Username and password are required');
      return;
    }

    const request = this.isRegisterMode()
      ? this.auth.register(this.username, this.password)
      : this.auth.login(this.username, this.password);

    request.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Something went wrong');
      },
    });
  }
}
