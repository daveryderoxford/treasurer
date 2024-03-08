import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Claim, isPaid, isAwaitingPayment, isCanceled } from '../../claim.model';

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
      .filter((c) => isPaid(c))
      .reduce <number>((total, c) => total + c.amount, 0.0));

  awaitingPayment = computed<number>(() =>
    this.claims()
      .filter((c) => isAwaitingPayment(c))
      .reduce<number>((total, c) => total + c.amount, 0.0));

  canceled = computed<number>(() =>
    this.claims()
      .filter((c) => isCanceled(c))
      .reduce<number>((total, c) => total + c.amount, 0.0));

}





