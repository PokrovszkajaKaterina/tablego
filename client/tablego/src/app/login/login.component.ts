import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    this.isLoading = true;
    setTimeout(() => {
      if (this.email && this.password) {
        this.errorMessage = '';
        this.authService.login(this.email, this.password).subscribe({
          next: (data) => {
            if (data) {
              this.isLoading = false;
              this.router.navigateByUrl('/home');
            }
          }, error: (err) => {
            this.errorMessage = 'Hiba történt a bejelentkezés során!';
            this.isLoading = false;
          },
        })
      } else {
        this.isLoading = false;
        this.errorMessage = 'Hiányoznak a bejelentkezési adatok!';
      }
    }, 1500);
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
