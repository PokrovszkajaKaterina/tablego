import {Component, OnInit} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface VersionInfo {
  version: string;
  buildNumber: string;
  buildTime: string;
}

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    MatIcon,
    NgIf
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  version = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  async ngOnInit() {
    try {
      const versionInfo = await firstValueFrom(
        this.http.get<VersionInfo>('/assets/version.json')
      );
      this.version = `v${versionInfo.version}`;
    } catch (error) {
      console.error('Failed to load version info', error);
      this.version = '';
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
