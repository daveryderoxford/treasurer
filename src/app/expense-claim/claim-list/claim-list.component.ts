import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout';
import { AuthButtonComponent } from '../../auth/auth-button/auth-button.component';
import { AuthService } from '../../auth/auth.service';
import { DialogsService } from '../../shared';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { Claim } from '../claim.model';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [FlexModule, CommonModule, AuthButtonComponent, MatButtonModule, RouterLink, MatListModule, MatIconModule, ToolbarComponent, MatDividerModule, MatLineModule, DatePipe],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})

export class ClaimListComponent {

  constructor(public ls: ClaimService,
    public auth: AuthService,
    private router: Router,
    private ds: DialogsService) {
  }

  async delete(claim: Claim) {

    if (await this.ds.confirm('Delete claim', 'Delete leauge?.')) {
      await this.ls.delete(claim.id);
    }
  }

  async edit(claim: Claim) {
    console.log('Editing: ' + claim.id);
    this.router.navigate(['claims/edit', claim.id]);
  }
}
