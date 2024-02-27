import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthButtonComponent } from '../../auth/auth-button/auth-button.component';

@Component({
    selector: 'app-toolbar',
    template: `
<mat-toolbar color="primary">
   <ng-content> </ng-content>
   <app-auth-button></app-auth-button>
</mat-toolbar>
    `,
    standalone: true,
    imports: [MatToolbarModule, AuthButtonComponent]
})
export class ToolbarComponent {

   constructor (  ) { }

}
