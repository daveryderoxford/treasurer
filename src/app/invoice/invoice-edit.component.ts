import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToolbarComponent } from '../shared/components/toolbar.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { Invoice } from './invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice-edit',
  standalone: true,
  imports: [InvoiceFormComponent, ToolbarComponent],
  template: `
     @defer {
      <app-toolbar [title]="title()"></app-toolbar>
      <app-invoice-form [invoice]="invoice()" #invoiceform (submitted)="submitted($event)"></app-invoice-form>
  }
  `,
  styles: ``
})
export class InvoiceEditComponent {
  id = signal<string | null>("");

  invoice = computed<Invoice>(
    () => this.invService.invoices().find((invoice => invoice.id === this.id()))!
  );

  title = computed(() => 'Edit invoice  ' + this.id());

  @ViewChild('invoiceform') invoiceForm: InvoiceFormComponent | undefined;

  constructor(private invService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id.set(params['id']);
    });
  }

  async submitted(data: Partial<Invoice>) {
    await this.invService.update(this.id()!, data);
    this.router.navigate(["/invoices"]);
  }

  canDeactivate(): boolean {
    return this.invoiceForm!.canDeactivate();
  }
}
