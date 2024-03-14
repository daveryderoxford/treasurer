import { Component, booleanAttribute, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthButtonComponent } from '../../auth/auth-button/auth-button.component';
import { TreasurerButtonComponent } from '../../treasurer/treasurer-button/treasurer-button.component';
import { BackButtonDirective } from './back-button/back-button.direcrtive';

@Component({
    selector: 'app-toolbar',
    template: `
<mat-toolbar class=app-toolbar>
   @if (showBack()) {
      <button mat-icon-button navigateBack>
        <mat-icon>arrow_back</mat-icon>
      </button>
   }
   {{title()}}
   <div class=spacer></div>
   <ng-content> </ng-content>
   <app-treasurer-button></app-treasurer-button>
</mat-toolbar>
    `,
    standalone: true,
    imports: [TreasurerButtonComponent, BackButtonDirective,  MatToolbarModule, AuthButtonComponent, MatButtonModule, MatIconModule, RouterModule],
    styles: ['.spacer { flex: 1 1 auto; }']

})
export class ToolbarComponent {

    title = input('');

    showBack = input(true, {transform: booleanAttribute});

   constructor (  ) { }

}
