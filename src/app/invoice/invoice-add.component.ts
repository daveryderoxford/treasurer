import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToolbarComponent } from '../shared/components/toolbar.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { Invoice } from './invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [InvoiceFormComponent, ToolbarComponent],
  template: `@defer {
    <app-toolbar title="IBRSC - New invoice"></app-toolbar>
    <app-invoice-form #invoiceform (submitted)="submitted($event)"></app-invoice-form>
  }
  `,
  styles: [],
})
export class InvoiceAddComponent {

  private createInvoice(formData: Partial<Invoice>): Invoice {
    const defaultInvoice: Partial<Invoice> = {
      id: '',
      attachments: [],
      amount: 0,
      state: 'Submitted',
      reason: '',
      description: '',
      dateSubmitted: new Date(),
    };
    return { ...defaultInvoice, ...formData } as Invoice;
  }

  @ViewChild('invoiceform') invoiceForm: InvoiceFormComponent | undefined;

  constructor(
    private invService: InvoiceService,
    private router: Router,
    public auth: AuthService) { }

  async submitted(formData: Partial<Invoice>) {
    this.router.navigate(["/invoices"]);
    const invoice = this.createInvoice(formData);
    try {
      await this.invService.add(invoice);
    } catch (e: any) {
      console.log('Error encountered saving invoice' + e.toSting());
    }
  }

  canDeactivate(): boolean {
    return this.invoiceForm!.canDeactivate();
  }
}
