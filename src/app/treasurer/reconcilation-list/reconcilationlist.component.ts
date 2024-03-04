import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Claim } from '../../expense-claim/claim.model';
import { ReconcilationResult } from '../reconcilation.service';

@Component({
  selector: 'app-reconcilation-list',
  standalone: true,
  imports: [DatePipe, MatListModule, MatIconModule ],
  templateUrl: './reconcilation-list.component.html',
  styleUrl: './reconcilation-list.component.scss'
})
export class ResolutionListComponent {

  results = input<ReconcilationResult[]>([]);

  constructor(private router: Router) { }

  async edit(claim: Claim) {
    console.log('Editing: ' + claim.id);
    this.router.navigate(['claims/edit', claim.id]);
  }
}
