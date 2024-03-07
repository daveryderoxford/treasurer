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
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';

function filterInvoice(invoice: Invoice, filter: string): boolean {
  return !filter || filter === '' ||
    invoice.name.toLowerCase().includes(filter) ||
    invoice.id.toLowerCase().includes(filter) ||
    invoice.description.toLowerCase().includes(filter);
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [FlexModule, CommonModule, ListContainerComponent, AuthButtonComponent, DecimalPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, MatListModule, MatIconModule, ToolbarComponent, MatDividerModule, MatLineModule, DatePipe],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {
  searchFilter = signal('');
  filteredInvoices: Signal<Invoice[]>;

  constructor(public ls: InvoiceService,
    public auth: AuthService,
    private router: Router,
    private ds: DialogsService) {

    this.filteredInvoices = computed(() => {
      const filter = this.searchFilter();
      return this.ls.invoices().filter((invoice) => filterInvoice(invoice, filter));
    });
  }

  async delete(invoice: Invoice) {
    if (await this.ds.confirm('Delete invoice', 'Delete invoice?.')) {
      await this.ls.delete(invoice.id);
    }
  }

  async edit(invoice: Invoice) {
    console.log('Editing: ' + invoice.id);
    this.router.navigate(['invoices/edit', invoice.id]);
  }

  searchKeyPressed(filter: string) {
    this.searchFilter.set(filter.toLowerCase());
  }
}
