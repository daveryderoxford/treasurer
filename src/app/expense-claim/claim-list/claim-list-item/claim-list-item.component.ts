
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Claim, isAwaitingPayment, isCanceled } from '../../claim.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-claim-list-item',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatButtonModule, MatListModule, MatIconModule, MatDividerModule, DatePipe],
  templateUrl: './claim-list-item.component.html',
  styleUrl: './claim-list-item.component.scss'
})
export class ClaimListItemComponent {

  claim = input.required<Claim>();

  @Output() edit = new EventEmitter<Claim>()

  constructor(public auth: AuthService) { }

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
