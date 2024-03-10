import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, NgZone, Output, ViewChild, computed, effect, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { Claim, claimStates } from '../claim.model';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [FormContainerComponent, FlexModule, MatDividerModule, MatAutocompleteModule, UploadListComponent, UploadButtonComponent, ToolbarComponent, TextFieldModule, MatExpansionModule, MatOptionModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss'
})
export class ClaimFormComponent {

  claim = input<Claim | null>();
  @Output() submitted = new EventEmitter<Partial<Claim>>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  claimStates = claimStates;

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
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

  nameFilter = toSignal<string | null>(this.form.controls.name.valueChanges);

  allNames = computed<string[]>(() => {
    const names = this.cs.claims().map(claim => claim.name);
    const distinct = [...new Set(names)].sort((a, b) => a.localeCompare(b));
    return distinct;
  });

  filteredNames = computed<string[]>(() => {
    const filter = this.nameFilter()?.toLowerCase();
    if (filter) {
      return this.allNames().filter(n => n.toLowerCase().includes(filter))
    } else {
      return this.allNames();
    }
  }
  );

  constructor(private cs: ClaimService, private _ngZone: NgZone) {

    effect(() => {
      if (this.claim()) {
        this.form.patchValue(this.claim()!);
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
    const output: Partial<Claim> = this.form.getRawValue() as Partial<Claim>;
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

  /// Fill details fromm the most recent claim for the person
  fillValues() {
    const claim = this.cs.claims().find( c => c.name === this.nameFilter());
    if (claim) {
      this.form.patchValue( {
        bankAccountHolder: claim.bankAccountHolder,
        bankSortCode: claim.bankSortCode,
        bankAccountNo: claim.bankAccountNo,
        email: claim.email
      });
    }

  }

}
