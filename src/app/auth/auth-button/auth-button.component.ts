import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink, NgIf],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {

  authorised = false;
  user: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    authState(this.auth)
      .pipe(untilDestroyed(this))
      .subscribe((u) => {
        this.authorised = (u !== null);
        this.user = u;
      });
  }

  async logout() {
    await this.auth.signOut();
    await this.router.navigateByUrl('auth/login');
  }
}
