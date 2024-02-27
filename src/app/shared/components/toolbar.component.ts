import { Component, booleanAttribute, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthButtonComponent } from '../../auth/auth-button/auth-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-toolbar',
    template: `
<mat-toolbar color="primary">
   @if (showBack()) {
      <button [routerLink]="['/']" mat-icon-button>
        <mat-icon>arrow_back</mat-icon>
      </button>
   }
   {{title()}}
   <div class=spacer></div>
   <ng-content> </ng-content>

</mat-toolbar>
    `,
    standalone: true,
    imports: [MatToolbarModule, AuthButtonComponent, MatButtonModule, MatIconModule, RouterModule],
    styles: ['.spacer { flex: 1 1 auto; }']

})
export class ToolbarComponent {


    title = input('');

    showBack = input(true, {transform: booleanAttribute});

   constructor (  ) { }

}
