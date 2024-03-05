import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, EventEmitter, NgZone, Output, ViewChild, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { Claim, claimStates } from '../claim.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [FormContainerComponent, FlexModule, MatDividerModule, UploadListComponent, UploadButtonComponent, ToolbarComponent, TextFieldModule, MatExpansionModule, MatOptionModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss'
})
export class ClaimFormComponent {

  claim = input<Claim | null>();
  @Output() submitted = new EventEmitter<Partial<Claim>>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;


  claimStates = claimStates;
/*
  private currancyReg = '/^(?!0+\.0+$)\d{1,3}(?:,\d{3})*\.\d{2}$/';
  private bankACReg = '/^[0-9]{9,18}$/';
  private sortCodeReg = '/^(\d){2}-(\d){2}-(\d){2}$/'; */

  private currancyReg = '';
  private bankACReg = '';
  private sortCodeReg = ''; 

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.email, Validators.required] }),
    amount: new FormControl<number>(0.00, { validators: [Validators.pattern(this.currancyReg), Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    bankAccountHolder: new FormControl('', { validators: [] }),
    bankAccountNo: new FormControl<number>(0, { validators: [Validators.pattern(this.bankACReg)] }),
    bankSortCode: new FormControl('', { validators: [Validators.pattern(this.sortCodeReg)] }),
    state: new FormControl('', Validators.required),
    notes: new FormControl(''),
    attachments: new FormControl<Attachment[]>([], { nonNullable: true })
  });

  constructor(private _ngZone: NgZone) {
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
}
