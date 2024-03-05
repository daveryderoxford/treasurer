import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Claim } from '../../claim.model';

function paid(c: Claim): boolean {
  return c.state === 'Paid' || c.state === 'Reconciled' || c.state === 'Error';
}

function awaitingPayment(c: Claim): boolean {
  return c.state === 'Approved' || c.state === 'Submitted';
}

function canceled(c: Claim): boolean {
  return c.state === 'Cancelled' || c.state === 'Rejected';
}

@Component({
  selector: 'app-claim-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './claim-summary.component.html',
  styleUrl: './claim-summary.component.scss'
})
export class ClaimSummaryComponent {

  claims = input<Claim[]>([]);

  paid = computed<number>(() =>
    this.claims()
      .filter((c) => paid(c))
      .reduce <number>((total, c) => total + c.amount, 0.0));

  awaitingPayment = computed<number>(() =>
    this.claims()
      .filter((c) => awaitingPayment(c))
      .reduce<number>((total, c) => total + c.amount, 0.0));

  canceled = computed<number>(() =>
    this.claims()
      .filter((c) => canceled(c))
      .reduce<number>((total, c) => total + c.amount, 0.0));

}





