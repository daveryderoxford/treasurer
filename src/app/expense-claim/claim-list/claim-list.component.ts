import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout';
import { AuthButtonComponent } from '../../auth/auth-button/auth-button.component';
import { AuthService } from '../../auth/auth.service';
import { DialogsService } from '../../shared';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { Claim, isAwaitingPayment, isCanceled } from '../claim.model';
import { ClaimService } from '../claim.service';
import { ClaimSummaryComponent } from './claim-summary/claim-summary.component';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';

function filterClaim(claim: Claim, filter: string): boolean {
  return !filter || filter === '' ||
    claim.name.toLowerCase().includes(filter) ||
    claim.id.toLowerCase().includes(filter) ||
    claim.description.toLowerCase().includes(filter);
}

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [FlexModule, CommonModule, ListContainerComponent, AuthButtonComponent, ClaimSummaryComponent, DecimalPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, MatListModule, MatIconModule, ToolbarComponent, MatDividerModule, MatLineModule, DatePipe],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})

export class ClaimListComponent {

  searchFilter = signal('');
  filteredClaims: Signal<Claim[]>;

  constructor(public ls: ClaimService,
    public auth: AuthService,
    private router: Router,
    private ds: DialogsService) {

    this.filteredClaims = computed(() => {
      const filter = this.searchFilter();
      return this.ls.claims().filter((claim) => filterClaim(claim, filter));
    });
  }

  async delete(claim: Claim) {
    if (await this.ds.confirm('Delete claim', 'Delete claim?.')) {
      await this.ls.delete(claim.id);
    }
  }

  async edit(claim: Claim) {
    console.log('Editing: ' + claim.id);
    this.router.navigate(['claims/edit', claim.id]);
  }

  searchKeyPressed(filter: string) {
    this.searchFilter.set(filter.toLowerCase());
  }

  stateColor(claim: Claim): string {
    if (isAwaitingPayment(claim)) {
      return 'green';
    } else if (isCanceled(claim)) {
      return 'red';
    } else {
      return 'black';
    }
  }
}