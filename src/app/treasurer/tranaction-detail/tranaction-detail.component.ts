import { DatePipe } from '@angular/common';
import { Component, effect, input, signal, computed, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ClaimListItemComponent } from '../../expense-claim/claim-list/claim-list-item/claim-list-item.component';
import { Claim } from '../../expense-claim/claim.model';
import { Transaction } from '../reconcilation.model';
import { ReconciliationService } from '../reconcilation.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';

@Component({
  selector: 'app-tranaction-detail',
  standalone: true,
  imports: [ClaimListItemComponent, ToolbarComponent, DatePipe, ListContainerComponent, FlexLayoutModule, MatListModule, MatIconModule, MatDividerModule, MatCardModule, MatButtonModule],
  templateUrl: './tranaction-detail.component.html',
  styleUrl: './tranaction-detail.component.scss'
})
export class TranactionDetailComponent implements OnInit {

  id = signal<string | null>("");
  
  transaction = computed<Transaction>(
    () => this.rs.transactions().find((trans => trans.id === this.id()))!
  );

  constructor(protected rs: ReconciliationService,
    private route: ActivatedRoute,
    private router: Router) {
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id.set(params['id']);
    });
  }

  add() {

  }

  edit(claim: Claim) {
    console.log('Editing: ' + claim.id);
    this.router.navigate(['claims/edit', claim.id]);
  }

  canDeactivate(): boolean {
    return true;
  }
}