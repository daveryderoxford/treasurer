import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Transaction } from '../reconcilation.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reconcilation-list',
  standalone: true,
  imports: [DatePipe, FlexLayoutModule, MatListModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './reconcilation-list.component.html',
  styleUrl: './reconcilation-list.component.scss'
})
export class ResolutionListComponent {

  transactions = input<Transaction[]>([]);

  constructor(private router: Router) { }

  async edit(trans: Transaction) {
    console.log('Editing transaction.  id: ' + trans.id);
    this.router.navigate(['treasurer/transactions/edit/', trans.id]);
  }
}
