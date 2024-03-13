import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, NgZone, Output, ViewChild, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexModule } from '@ngbracket/ngx-layout';
import { take } from 'rxjs';
import { GoogleStorageReference } from '../../shared/components/file-upload/google-storage-ref.model';
import { GggoleStorageUploadComponent } from '../../shared/components/file-upload/google-storage-upload-button';
import { UploadListComponent } from '../../shared/components/file-upload/upload-list/upload-list.component';
import { FormContainerComponent } from '../../shared/components/form-container/form-container.component';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { currencyValidator } from '../../shared/validators';
import { Claim } from '../claim.model';

@Component({
  selector: 'app-user-claim-form',
  standalone: true,
  imports: [FormContainerComponent, UploadListComponent, GggoleStorageUploadComponent, ToolbarComponent, FlexModule, MatDividerModule,TextFieldModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './user-claim-form.component.html',
  styleUrl: './user-claim-form.component.scss'
})
export class UserClaimFormComponent {

  claim = input<Claim | null>();
  @Output() submitted = new EventEmitter<Partial<Claim>>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  form = new FormGroup({
    amount: new FormControl<number | null>(null, { validators: [currencyValidator, Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    attachments: new FormControl<GoogleStorageReference[]>([], { nonNullable: true })
  });

  constructor(private _ngZone: NgZone) {
    effect(() => {
      if (this.claim()) {
        this.form.patchValue(this.claim()!);
      }
    });
  }

  /** Get/set the attachments from the form control */
  get attachments(): GoogleStorageReference[] {
    return this.form.controls.attachments.getRawValue();
  }
  set attachments(value: GoogleStorageReference[]) {
    this.form.controls.attachments.setValue(value);
  }

  attachmentUploaded(added: GoogleStorageReference[]) {
    this.attachments = [...this.attachments, ...added];
  }

  attachmentDeleted(removed: GoogleStorageReference) {
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
}
