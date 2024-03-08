
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, NgZone, Output, ViewChild, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexModule } from '@ngbracket/ngx-layout';
import { take } from 'rxjs';
import { Attachment } from '../../shared/components/file-upload/file-upload.model';
import { UploadButtonComponent } from '../../shared/components/file-upload/upload-button/upload-button.component';
import { UploadListComponent } from '../../shared/components/file-upload/upload-list/upload-list.component';
import { FormContainerComponent } from '../../shared/components/form-container/form-container.component';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { bankACValidator, currencyValidator, sortCodeValidator } from '../../shared/validators';
import { Invoice, invoiceStates } from '../invoice.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [FormContainerComponent, FlexModule, MatDividerModule, UploadListComponent, UploadButtonComponent, ToolbarComponent, TextFieldModule, MatExpansionModule, MatOptionModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent {

  invoice = input<Invoice | null>();
  @Output() submitted = new EventEmitter<Partial<Invoice>>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  invoiceStates = invoiceStates;

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    organisation: new FormControl(''),
    email: new FormControl('', { validators: [Validators.email, Validators.required] }),
    amount: new FormControl<number | null>(null, { validators: [currencyValidator, Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    bankAccountHolder: new FormControl('', { validators: [] }),
    bankAccountNo: new FormControl<number | null>(null, { validators: [bankACValidator] }),
    bankSortCode: new FormControl('', { validators: [sortCodeValidator] }),
    state: new FormControl('', Validators.required),
    reason: new FormControl(''),
    attachments: new FormControl<Attachment[]>([], { nonNullable: true })
  });

  constructor(private _ngZone: NgZone) {
    effect(() => {
      if (this.invoice()) {
        this.form.patchValue(this.invoice()!);
      }
    });
  }

  /** Get/set the attachments from the form control */
  get attachments(): Attachment[] {
    return this.form.controls.attachments.getRawValue();
  }
  set attachments(value: Attachment[]) {
    this.form.controls.attachments.setValue(value);
  }

  attachmentUploaded(added: Attachment[]) {
    this.attachments = [...this.attachments, ...added];
  }

  attachmentDeleted(removed: Attachment) {
    const files = this.attachments;

    const index = files.indexOf(removed);
    if (index > -1) {
      files.splice(index, 1);
    }
    this.attachments = [...files];
  }

  submit() {
    const output: Partial<Invoice> = this.form.getRawValue() as Partial<Invoice>;
    this.submitted.emit(output);
    this.form.reset();
  }

  public canDeactivate(): boolean {
    return !this.form.dirty;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize!.resizeToFitContent(true));
  }
}

