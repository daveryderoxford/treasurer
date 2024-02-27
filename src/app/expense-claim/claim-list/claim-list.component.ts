import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { DialogsService } from '../../shared';
import { Claim } from '../claim.model';
import { ClaimService } from '../claim.service';
import { ToolbarComponent } from '../../shared/components/toolbar.component';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatListModule, MatIconModule, ToolbarComponent, MatDividerModule, MatLineModule, NgIf, NgFor, DatePipe],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})

export class ClaimListComponent {

  constructor(public ls: ClaimService,
    private auth: Auth,
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
