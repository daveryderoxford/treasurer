import { Component } from '@angular/core';
  import { Auth, User, authState } from '@angular/fire/auth';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { MatMenuModule } from '@angular/material/menu';
  import { Router, RouterLink } from '@angular/router';
  import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../auth/auth.service';


  @Component({
    selector: 'app-treasurer-button',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
    templateUrl: './treasurer-button.component.html',
    styleUrl: './treasurer-button.component.scss'
  })
  export class TreasurerButtonComponent {
  
    constructor(public auth: AuthService, private router: Router) {
    }

    resolve() {}
  
  }
  
